function AuthInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="input-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default AuthInput;