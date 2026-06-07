import { useEffect, useState } from 'react';
import type { UseTypewriterOptions } from './useTypewriter.types';

const useTypewriter = (
  phrases: string[],
  { typingSpeed = 32, deletingSpeed = 16, pauseDuration = 1300 }: UseTypewriterOptions = {},
): string => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;

    const current = phrases[phraseIndex % phrases.length];

    if (!isDeleting && text === current) {
      const timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && text === '') {
      setIsDeleting(false);
      setPhraseIndex((index) => (index + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(
      () =>
        setText((prev) =>
          isDeleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
        ),
      isDeleting ? deletingSpeed : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
};

export default useTypewriter;
