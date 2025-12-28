import { useEffect, useRef } from 'react';
import { InputWithLabelProps } from '../../types/types';

const InputWithLabel = ({
  id,
  type = 'text',
  value,
  placeholder,
  isFocused = false,
  onInputChange,
  children,
  onFocus,
  onBlur,
}: InputWithLabelProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFocused && inputRef.current) inputRef.current.focus();
  }, [isFocused]);

  return (
    <div>
      {children && <label htmlFor={id}>{children}&nbsp;</label>}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};

export default InputWithLabel;
