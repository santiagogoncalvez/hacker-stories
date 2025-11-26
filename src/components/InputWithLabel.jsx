const InputWithLabel = ({
  id,
  type = 'text',
  value,
  isFocused = false,
  onInputChange,
  children,
}) => {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  );
};

export default InputWithLabel;
