import type { MainEvent } from '@/types/fightEvent.types';
import type { YTPlayer, YTPlayerOptions, YouTubeNamespace } from '@/types/youtube.types';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { LanguageProvider } from '@/i18n';
import es from '@/i18n/locales/es';
import CinematicHero from './CinematicHero';

const youtube = vi.hoisted(() => {
  const PlayerState = { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 };
  const harness: { events: YTPlayerOptions['events']; state: number } = {
    events: undefined,
    state: PlayerState.UNSTARTED,
  };
  const iframe = document.createElement('iframe');
  const player: YTPlayer = {
    playVideo: vi.fn(),
    pauseVideo: vi.fn(),
    seekTo: vi.fn(),
    loadVideoById: vi.fn(),
    getCurrentTime: () => 0,
    getDuration: () => 0,
    getPlayerState: () => harness.state,
    mute: vi.fn(),
    unMute: vi.fn(),
    getIframe: () => iframe,
    destroy: vi.fn(),
  };
  const Player = vi.fn((_element: HTMLElement | string, options: YTPlayerOptions) => {
    harness.events = options.events;
    return player;
  });
  const namespace = { Player, PlayerState } as unknown as YouTubeNamespace;
  return { harness, player, namespace, PlayerState };
});

vi.mock('@/utils/youtubeIframeApi', () => ({
  loadYouTubeIframeApi: () => Promise.resolve(youtube.namespace),
}));

const YOUTUBE_EMBED_NOT_ALLOWED = 150;

const makeEvent = (overrides: Partial<MainEvent> = {}): MainEvent => ({
  id: 1,
  idYt: 'firstVideo1',
  title: 'Chávez vs Taylor',
  description: '',
  tags: [],
  startTime: '0',
  ...overrides,
});

const SECOND_FIGHT = makeEvent({ id: 2, idYt: 'secondVideo', title: 'Barrera vs Morales' });

const heroProps = {
  countryName: 'México',
  stats: { fightsCount: 2, cities: [], disciplines: [] },
  autoplayAllowed: true,
  isLoaderCovering: false,
  onReady: () => {},
};

const REVEAL_FALLBACK_MS = 8000;

const renderHero = async (video: MainEvent) => {
  const view = render(
    <LanguageProvider>
      <CinematicHero video={video} {...heroProps} />
    </LanguageProvider>,
  );
  await act(async () => {});
  act(() => youtube.harness.events?.onReady?.({ target: youtube.player, data: 0 }));
  return view;
};

const titleCardLayer = (fighterName: string) =>
  screen.getByText(fighterName).closest('[aria-hidden="true"]')?.parentElement;

const emit = (handler: 'onStateChange' | 'onError', data: number) =>
  act(() => youtube.harness.events?.[handler]?.({ target: youtube.player, data }));

describe('CinematicHero title card when the video fails', () => {
  beforeEach(() => {
    window.localStorage.setItem('preferredLanguage', 'es');
    window.YT = youtube.namespace;
    youtube.harness.state = youtube.PlayerState.UNSTARTED;
  });

  afterEach(() => {
    window.localStorage.clear();
    delete window.YT;
    vi.clearAllMocks();
  });

  it('lifts the card and offers play when the first video errors', async () => {
    await renderHero(makeEvent());

    expect(titleCardLayer('Chávez')).toHaveStyle({ opacity: '1' });

    emit('onError', YOUTUBE_EMBED_NOT_ALLOWED);

    expect(titleCardLayer('Chávez')).toHaveStyle({ opacity: '0' });
    expect(screen.getByRole('button', { name: es['hero.play'] })).toBeInTheDocument();
  });

  it('lifts the card and offers play when a video loaded by a fight switch errors', async () => {
    const { rerender } = await renderHero(makeEvent());
    youtube.harness.state = youtube.PlayerState.PLAYING;
    emit('onStateChange', youtube.PlayerState.PLAYING);

    rerender(
      <LanguageProvider>
        <CinematicHero video={SECOND_FIGHT} {...heroProps} />
      </LanguageProvider>,
    );

    expect(youtube.player.loadVideoById).toHaveBeenCalledWith({
      videoId: 'secondVideo',
      startSeconds: 0,
    });
    expect(titleCardLayer('Barrera')).toHaveStyle({ opacity: '1' });
    expect(screen.getByRole('button', { name: es['hero.pause'] })).toBeInTheDocument();

    youtube.harness.state = youtube.PlayerState.UNSTARTED;
    emit('onError', YOUTUBE_EMBED_NOT_ALLOWED);

    expect(titleCardLayer('Barrera')).toHaveStyle({ opacity: '0' });
    expect(screen.getByRole('button', { name: es['hero.play'] })).toBeInTheDocument();
  });
});

describe('CinematicHero country block while the title card is up', () => {
  const countryBlock = () => screen.getByRole('heading', { level: 1 }).parentElement;
  const scrollHint = () => screen.getByLabelText(es['mainEvent.scrollHint']);

  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.setItem('preferredLanguage', 'es');
    window.YT = youtube.namespace;
    youtube.harness.state = youtube.PlayerState.UNSTARTED;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
    delete window.YT;
    vi.clearAllMocks();
  });

  it('hides the block and the scroll hint with the card and shows them once it lifts', async () => {
    await renderHero(makeEvent());

    expect(titleCardLayer('Chávez')).toHaveStyle({ opacity: '1' });
    expect(countryBlock()).toHaveStyle({ opacity: '0' });
    expect(scrollHint()).toHaveAttribute('aria-hidden', 'true');
    expect(scrollHint()).toHaveStyle({ opacity: '0' });

    youtube.harness.state = youtube.PlayerState.PLAYING;
    emit('onStateChange', youtube.PlayerState.PLAYING);
    act(() => vi.advanceTimersByTime(5000));

    expect(titleCardLayer('Chávez')).toHaveStyle({ opacity: '0' });
    expect(countryBlock()).toHaveStyle({ opacity: '1' });
    expect(scrollHint()).toHaveAttribute('aria-hidden', 'false');
    expect(scrollHint()).toHaveStyle({ opacity: '0.9' });
  });

  it('hides the block again when a fight switch brings the card back', async () => {
    const { rerender } = await renderHero(makeEvent());
    youtube.harness.state = youtube.PlayerState.PLAYING;
    emit('onStateChange', youtube.PlayerState.PLAYING);
    act(() => vi.advanceTimersByTime(5000));

    rerender(
      <LanguageProvider>
        <CinematicHero video={SECOND_FIGHT} {...heroProps} />
      </LanguageProvider>,
    );

    expect(titleCardLayer('Barrera')).toHaveStyle({ opacity: '1' });
    expect(countryBlock()).toHaveStyle({ opacity: '0' });
  });

  it('lifts the card and brings the headline back when the player never becomes ready', async () => {
    render(
      <LanguageProvider>
        <CinematicHero video={makeEvent()} {...heroProps} />
      </LanguageProvider>,
    );
    await act(async () => {});

    act(() => vi.advanceTimersByTime(REVEAL_FALLBACK_MS));

    expect(titleCardLayer('Chávez')).toHaveStyle({ opacity: '0' });
    expect(countryBlock()).toHaveStyle({ opacity: '1' });
    expect(scrollHint()).toHaveAttribute('aria-hidden', 'false');
  });

  it('covers a player that becomes ready after the fallback lifted the card', async () => {
    render(
      <LanguageProvider>
        <CinematicHero video={makeEvent()} {...heroProps} />
      </LanguageProvider>,
    );
    await act(async () => {});
    act(() => vi.advanceTimersByTime(REVEAL_FALLBACK_MS));

    act(() => youtube.harness.events?.onReady?.({ target: youtube.player, data: 0 }));

    expect(titleCardLayer('Chávez')).toHaveStyle({ opacity: '1' });
    expect(countryBlock()).toHaveStyle({ opacity: '0' });
  });
});

describe('CinematicHero title card entrance', () => {
  const FIRST_FIGHT = makeEvent();
  const surname = () => screen.getByText('Chávez');

  beforeEach(() => {
    window.localStorage.setItem('preferredLanguage', 'es');
    window.YT = youtube.namespace;
    youtube.harness.state = youtube.PlayerState.UNSTARTED;
  });

  afterEach(() => {
    window.localStorage.clear();
    delete window.YT;
    vi.clearAllMocks();
  });

  it('replays the entrance once the loading overlay lifts', () => {
    const { rerender } = render(
      <LanguageProvider>
        <CinematicHero video={FIRST_FIGHT} {...heroProps} isLoaderCovering />
      </LanguageProvider>,
    );
    const renderedBehindLoader = surname();

    rerender(
      <LanguageProvider>
        <CinematicHero video={FIRST_FIGHT} {...heroProps} isLoaderCovering={false} />
      </LanguageProvider>,
    );

    expect(renderedBehindLoader).not.toBeInTheDocument();
    expect(surname()).toBeInTheDocument();
  });

  it('does not replay the entrance when the player becomes ready after the overlay lifted', async () => {
    render(
      <LanguageProvider>
        <CinematicHero video={FIRST_FIGHT} {...heroProps} />
      </LanguageProvider>,
    );
    await act(async () => {});
    const renderedInView = surname();

    act(() => youtube.harness.events?.onReady?.({ target: youtube.player, data: 0 }));

    expect(renderedInView).toBeInTheDocument();
  });

  it('does not replay the entrance when playback starts under reduced motion', async () => {
    render(
      <LanguageProvider>
        <CinematicHero video={FIRST_FIGHT} {...heroProps} autoplayAllowed={false} />
      </LanguageProvider>,
    );
    const renderedInView = surname();

    fireEvent.click(screen.getByRole('button', { name: es['hero.play'] }));
    await act(async () => {});
    act(() => youtube.harness.events?.onReady?.({ target: youtube.player, data: 0 }));

    expect(renderedInView).toBeInTheDocument();
  });
});

describe('CinematicHero reveal indicator', () => {
  const preparing = es['titleCard.preparing'];
  const startsIn = es['titleCard.startsIn'];
  const indicator = (label: string) => screen.getByText(label).parentElement?.parentElement;

  const emitState = (state: number) => {
    youtube.harness.state = state;
    emit('onStateChange', state);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.setItem('preferredLanguage', 'es');
    window.YT = youtube.namespace;
    youtube.harness.state = youtube.PlayerState.UNSTARTED;
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.clear();
    delete window.YT;
    vi.clearAllMocks();
  });

  it('shows the preparing label once the player is ready', async () => {
    await renderHero(makeEvent());

    expect(indicator(preparing)).toHaveStyle({ opacity: '1' });
    expect(screen.queryByText(startsIn)).not.toBeInTheDocument();
  });

  it('starts the countdown at the first PLAYING', async () => {
    await renderHero(makeEvent());

    emitState(youtube.PlayerState.PLAYING);

    expect(screen.getByText(startsIn)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('keeps counting through a buffering stutter', async () => {
    await renderHero(makeEvent());
    emitState(youtube.PlayerState.PLAYING);
    act(() => vi.advanceTimersByTime(2000));

    emitState(youtube.PlayerState.BUFFERING);
    emitState(youtube.PlayerState.PLAYING);

    expect(screen.getByText('3')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('brings back the preparing label with a fight switch and counts again for the new video', async () => {
    const { rerender } = await renderHero(makeEvent());
    emitState(youtube.PlayerState.PLAYING);
    act(() => vi.advanceTimersByTime(2000));

    rerender(
      <LanguageProvider>
        <CinematicHero video={SECOND_FIGHT} {...heroProps} />
      </LanguageProvider>,
    );

    expect(screen.getByText(preparing)).toBeInTheDocument();
    expect(screen.queryByText(startsIn)).not.toBeInTheDocument();

    emitState(youtube.PlayerState.PLAYING);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('hides while paused and returns with the time actually left on resume', async () => {
    await renderHero(makeEvent());
    emitState(youtube.PlayerState.PLAYING);
    act(() => vi.advanceTimersByTime(1000));

    emitState(youtube.PlayerState.PAUSED);

    expect(indicator(startsIn)).toHaveStyle({ opacity: '0' });
    expect(screen.getByRole('button', { name: es['hero.play'] })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1000));
    emitState(youtube.PlayerState.PLAYING);

    expect(indicator(startsIn)).toHaveStyle({ opacity: '1' });
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('stays hidden until play is pressed when autoplay is not allowed', async () => {
    render(
      <LanguageProvider>
        <CinematicHero video={makeEvent()} {...heroProps} autoplayAllowed={false} />
      </LanguageProvider>,
    );

    expect(indicator(preparing)).toHaveStyle({ opacity: '0' });

    fireEvent.click(screen.getByRole('button', { name: es['hero.play'] }));
    await act(async () => {});
    act(() => youtube.harness.events?.onReady?.({ target: youtube.player, data: 0 }));

    expect(indicator(preparing)).toHaveStyle({ opacity: '1' });
  });

  it('keeps the preparing label while the card fades on a video error', async () => {
    await renderHero(makeEvent());

    emit('onError', YOUTUBE_EMBED_NOT_ALLOWED);

    expect(titleCardLayer('Chávez')).toHaveStyle({ opacity: '0' });
    expect(screen.getByText(preparing)).toBeInTheDocument();
    expect(screen.queryByText(startsIn)).not.toBeInTheDocument();
  });
});
