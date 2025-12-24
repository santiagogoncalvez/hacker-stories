import { useEffect, useRef } from 'react';

type InputWithLabelProps = {
  id: string;
  type?: string;
  value: string;
  placeholder: string;
  isFocused?: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  onFocus: () => void;
  onBlur: () => void;
};

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
