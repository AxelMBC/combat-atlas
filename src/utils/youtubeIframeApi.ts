import type { YouTubeNamespace } from '@/types/youtube.types';

const API_SRC = 'https://www.youtube.com/iframe_api';

let apiPromise: Promise<YouTubeNamespace> | null = null;

export const loadYouTubeIframeApi = (): Promise<YouTubeNamespace> => {
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<YouTubeNamespace>((resolve) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      if (window.YT) resolve(window.YT);
    };

    const alreadyInjected = document.querySelector(`script[src="${API_SRC}"]`);
    if (!alreadyInjected) {
      const script = document.createElement('script');
      script.src = API_SRC;
      document.head.appendChild(script);
    }
  });

  return apiPromise;
};
