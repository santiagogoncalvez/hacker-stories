
// components/common/CloseButton.tsx
import { MouseEvent } from 'react';
import CrossIcon from '../../assets/cross.svg?react';

interface CloseButtonProps {
  size?: number;
  className?: string;
  onMouseDown?: (e: MouseEvent<HTMLElement>) => void;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
}

const CloseButton = ({
  onMouseDown,
  onClick,
  size = 14,
  className = '',
}: CloseButtonProps) => {
  return (
    <button
      type="button"
      className={`close-button ${className}`}
      onClick={(e) => {
        e.stopPropagation(); 
        // SOLUCIÓN: Usamos ?. para que solo se ejecute si onClick existe
        onClick?.(e);
      }}
      onMouseDown={onMouseDown}
      aria-label="Eliminar"
    >
      {/* Corregido: "widtgh" -> "width" */}
      <CrossIcon width={size} height={size} style={{ strokeWidth: '2' }} />
    </button>
  );
};

export default CloseButton;