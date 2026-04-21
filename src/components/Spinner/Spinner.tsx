import type { SpinnerProps } from "./Spinner.types";
import "./Spinner.scss";

const Spinner = ({
  size = "medium",
  label,
  fullscreen = true,
}: SpinnerProps) => {
  const bars = (
    <span className={`spinner spinner--${size}`} aria-hidden="true">
      <span className="spinner__bar" />
      <span className="spinner__bar" />
      <span className="spinner__bar" />
    </span>
  );

  const content = (
    <>
      {bars}
      {label !== undefined && (
        <span className="spinner__label" aria-hidden="true">
          {label}
        </span>
      )}
    </>
  );

  return (
    <div
      className={fullscreen ? "spinner-overlay" : "spinner-wrapper"}
      role="status"
      aria-label={label ?? "Cargando…"}
    >
      {content}
    </div>
  );
};

export default Spinner;
