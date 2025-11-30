const InputWithLabel = ({
  id,
  type = 'text',
  value,
  placeholder,
  isFocused = false,
  onInputChange,
  children,
}) => {
  return (
    <div>
      {children && <label htmlFor={id}>{children}&nbsp;</label>}
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </div>
  );
};

export default InputWithLabel;
