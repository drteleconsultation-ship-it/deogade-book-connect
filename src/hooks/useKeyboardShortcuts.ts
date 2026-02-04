import { useEffect, useCallback } from 'react';

interface KeyboardShortcuts {
  onBooking?: () => void;
  onHome?: () => void;
  onServices?: () => void;
  onAbout?: () => void;
  onContact?: () => void;
}

const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable
    ) {
      return;
    }

    // Don't trigger if modifier keys are pressed (except for specific combos)
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const key = event.key.toLowerCase();

    switch (key) {
      case 'b':
        event.preventDefault();
        shortcuts.onBooking?.();
        break;
      case 'h':
        event.preventDefault();
        shortcuts.onHome?.();
        break;
      case 's':
        event.preventDefault();
        shortcuts.onServices?.();
        break;
      case 'a':
        event.preventDefault();
        shortcuts.onAbout?.();
        break;
      case 'c':
        event.preventDefault();
        shortcuts.onContact?.();
        break;
      default:
        break;
    }
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
