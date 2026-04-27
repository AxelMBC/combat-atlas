import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type RejectionHandler = (err: unknown) => Promise<unknown>;

const { requestMock, getOnRejected, setOnRejected } = vi.hoisted(() => {
  let onRejected: RejectionHandler | undefined;
  return {
    requestMock: vi.fn(),
    getOnRejected: () => {
      if (!onRejected) throw new Error("interceptor not registered");
      return onRejected;
    },
    setOnRejected: (fn: RejectionHandler) => {
      onRejected = fn;
    },
  };
});

vi.mock("axios", () => ({
  default: {
    create: () => ({
      request: requestMock,
      interceptors: {
        response: {
          use: (_onFulfilled: unknown, onRejected: RejectionHandler) =>
            setOnRejected(onRejected),
        },
      },
    }),
  },
}));

import "./api";

interface AxiosErrorShape {
  config: Record<string, unknown>;
  response?: { status: number; data?: { message?: string } };
  message: string;
}

const makeError = (
  status: number | undefined,
  opts: { message?: string; dataMessage?: string } = {},
  config: Record<string, unknown> = {}
): AxiosErrorShape => ({
  config,
  response:
    status === undefined
      ? undefined
      : { status, data: opts.dataMessage ? { message: opts.dataMessage } : undefined },
  message: opts.message ?? "request failed",
});

describe("api response interceptor", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    requestMock.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("retry behavior", () => {
    it("retries on 5xx and resolves with the next attempt's success", async () => {
      const config: Record<string, unknown> = { url: "/foo" };
      requestMock.mockResolvedValueOnce({ status: 200, data: { ok: true } });

      const promise = getOnRejected()(makeError(500, {}, config));

      await vi.advanceTimersByTimeAsync(300);

      await expect(promise).resolves.toEqual({ status: 200, data: { ok: true } });
      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(requestMock).toHaveBeenCalledWith(config);
      expect(config._retryCount).toBe(1);
    });

    it("retries when the response is missing (network error)", async () => {
      const config: Record<string, unknown> = { url: "/foo" };
      requestMock.mockResolvedValueOnce({ status: 200 });

      const promise = getOnRejected()(makeError(undefined, {}, config));

      await vi.advanceTimersByTimeAsync(300);
      await promise;

      expect(requestMock).toHaveBeenCalledTimes(1);
      expect(config._retryCount).toBe(1);
    });

    it("does not retry on 4xx and rejects with the extracted message", async () => {
      const config: Record<string, unknown> = { url: "/foo" };

      const promise = getOnRejected()(
        makeError(
          400,
          { message: "axios said", dataMessage: "bad input" },
          config
        )
      );

      await expect(promise).rejects.toThrow("bad input");
      expect(requestMock).not.toHaveBeenCalled();
      expect(config._retryCount).toBeUndefined();
    });

    it("rejects after MAX_RETRIES failed attempts", async () => {
      const config: Record<string, unknown> = { url: "/foo" };

      const failingAttempt = (cfg: Record<string, unknown>) =>
        getOnRejected()(
          makeError(500, { message: "server down" }, cfg)
        );

      requestMock
        .mockImplementationOnce(failingAttempt)
        .mockImplementationOnce(failingAttempt)
        .mockImplementationOnce(failingAttempt);

      const promise = getOnRejected()(
        makeError(500, { message: "server down" }, config)
      );

      const assertion = expect(promise).rejects.toThrow("server down");
      await vi.runAllTimersAsync();
      await assertion;

      expect(requestMock).toHaveBeenCalledTimes(3);
      expect(config._retryCount).toBe(3);
    });

    it("waits 300ms before the first retry", async () => {
      const config: Record<string, unknown> = {};
      requestMock.mockResolvedValueOnce({ status: 200 });

      const promise = getOnRejected()(makeError(500, {}, config));

      await vi.advanceTimersByTimeAsync(299);
      expect(requestMock).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(1);
      expect(requestMock).toHaveBeenCalledTimes(1);

      await promise;
    });

    it("uses exponential backoff (600ms) before the second retry", async () => {
      const config: Record<string, unknown> = {};
      requestMock
        .mockImplementationOnce((cfg) =>
          getOnRejected()(makeError(500, { message: "fail" }, cfg))
        )
        .mockResolvedValueOnce({ status: 200 });

      const promise = getOnRejected()(makeError(500, { message: "fail" }, config));

      // Advance past the first 300ms delay → 1st retry fires
      await vi.advanceTimersByTimeAsync(300);
      expect(requestMock).toHaveBeenCalledTimes(1);

      // Second retry should not fire until 600ms more elapses
      await vi.advanceTimersByTimeAsync(599);
      expect(requestMock).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1);
      expect(requestMock).toHaveBeenCalledTimes(2);

      await promise;
    });
  });

  describe("error message extraction", () => {
    it("uses response.data.message when present", async () => {
      const promise = getOnRejected()(
        makeError(400, {
          message: "axios message (ignored)",
          dataMessage: "from server",
        })
      );

      await expect(promise).rejects.toThrow("from server");
    });

    it("falls back to error.message when response.data.message is absent", async () => {
      const promise = getOnRejected()(
        makeError(400, { message: "fallback message" })
      );

      await expect(promise).rejects.toThrow("fallback message");
    });
  });
});
