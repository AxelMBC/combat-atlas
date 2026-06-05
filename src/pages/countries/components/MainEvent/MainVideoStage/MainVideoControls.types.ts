export interface MainVideoControlsProps {
  visible: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
}
