import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="mb-4">
      {/* Label */}
      {label && (
        <label className="block mb-1 text-sm font-medium text-slate-800">
          {label}
        </label>
      )}

      {/* Input + Eye Icon wrapper */}
      <div className="input-box">
        <input
          type={
            type === 'password'
              ? showPassword
                ? 'text'
                : 'password'
              : type
          }
          placeholder={placeholder}
          className="bg-transparent w-full outline-none"
          value={value}
          onChange={onChange}
        />

        {/* Toggle eye icon for password */}
        {type === 'password' &&
          (showPassword ? (
            <FaRegEye
              size={20}
              className="text-primary cursor-pointer"
              onClick={toggleShowPassword}
            />
          ) : (
            <FaRegEyeSlash
              size={20}
              className="text-slate-400 cursor-pointer"
              onClick={toggleShowPassword}
            />
          ))}
      </div>
    </div>
  );
};

export default Input;
