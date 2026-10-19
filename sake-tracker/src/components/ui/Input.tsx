"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-gray-400 font-medium">{label}</label>
      )}
      <input
        className={`bg-navy-800 border border-white/10 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 outline-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
