import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

// type: "text" | "number" | "password";

function Input({ id, label, type, name, maxLength, ...rest }) {
  const [isShown, setIsShown] = useState(false);
  const togglePassword = () => {
    setIsShown((old) => !old);
  };
  const isPassword = type === "password";
  return (
    <div className="my-1">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        {isPassword && (
          <div
            className="absolute inset-y-[0.625rem] right-3 h-5 w-5 text-dark"
            onClick={togglePassword}
          >
            {isShown ? (
              <EyeIcon className="h-full w-full"/>
            ) : (
              <EyeSlashIcon className="h-full w-full"/>
            )}
          </div>
        )}
        <input
          type={isShown ? "text" : type}
          name={name}
          id={id}
          max={maxLength}
          className={`input ${isPassword ? "pr-12" : ""}`}
          {...rest}
        />
      </div>
    </div>
  );
}

export default Input;
