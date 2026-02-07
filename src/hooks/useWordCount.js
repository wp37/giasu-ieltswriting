import { useState, useCallback, useMemo } from 'react';

export function useWordCount(initialText = '') {
  const [text, setText] = useState(initialText);

  const wordCount = useMemo(() => {
    if (!text || text.trim() === '') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }, [text]);

  const characterCount = useMemo(() => {
    return text.length;
  }, [text]);

  const characterCountNoSpaces = useMemo(() => {
    return text.replace(/\s/g, '').length;
  }, [text]);

  const sentenceCount = useMemo(() => {
    if (!text || text.trim() === '') return 0;
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  }, [text]);

  const paragraphCount = useMemo(() => {
    if (!text || text.trim() === '') return 0;
    return text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  }, [text]);

  const updateText = useCallback((newText) => {
    setText(newText);
  }, []);

  const clear = useCallback(() => {
    setText('');
  }, []);

  const getWordCountStatus = useCallback((minWords) => {
    if (wordCount >= minWords) {
      return { status: 'good', message: `${wordCount} words (minimum met)` };
    } else if (wordCount >= minWords * 0.8) {
      return { status: 'warning', message: `${wordCount}/${minWords} words (almost there)` };
    } else {
      return { status: 'low', message: `${wordCount}/${minWords} words (need more)` };
    }
  }, [wordCount]);

  return {
    text,
    setText: updateText,
    clear,
    wordCount,
    characterCount,
    characterCountNoSpaces,
    sentenceCount,
    paragraphCount,
    getWordCountStatus
  };
}

export default useWordCount;
