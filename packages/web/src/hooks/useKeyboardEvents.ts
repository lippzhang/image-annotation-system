import { useEffect } from 'react';

interface UseKeyboardEventsProps {
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  isSpacePressed: boolean;
  setIsSpacePressed: (pressed: boolean) => void;
  setIsDragging: (dragging: boolean) => void;
  setLastPointerPosition: (pos: any) => void;
}

export const useKeyboardEvents = ({
  onUndo,
  onRedo,
  onDelete,
  isSpacePressed,
  setIsSpacePressed,
  setIsDragging,
  setLastPointerPosition,
}: UseKeyboardEventsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        onRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        onDelete();
      } else if (e.code === 'Space' && !isSpacePressed) {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
        setIsDragging(false);
        setLastPointerPosition(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onUndo, onRedo, onDelete, isSpacePressed, setIsSpacePressed, setIsDragging, setLastPointerPosition]);
};