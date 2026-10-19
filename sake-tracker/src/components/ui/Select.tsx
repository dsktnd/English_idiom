"use client";

import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly string[];
  placeholder?: string;
}

export default function Select({
  label,
  options,
  placeholder,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-gray-400 font-medium">{label}</label>
      )}
      <select
        className={`bg-navy-800 border border-white/10 rounded-lg px-4 py-3 text-gray-100 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 outline-none transition-colors appearance-none ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" className="text-gray-500">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
