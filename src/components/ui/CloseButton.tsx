// components/common/CloseButton.tsx
import React from 'react';
import CrossIcon from '../../assets/cross.svg?react';

interface CloseButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: number;
  className?: string;
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
        e.stopPropagation(); // Evita que al borrar se active el click del padre (seleccionar búsqueda)
        onClick(e);
      }}
      onMouseDown={onMouseDown}
      aria-label="Eliminar"
    >
      <CrossIcon widtgh={size} height={size} style={{ strokeWidth: '2' }} />
    </button>
  );
};

export default CloseButton;
