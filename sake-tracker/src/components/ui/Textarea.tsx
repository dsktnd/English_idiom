"use client";

import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({
  label,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm text-gray-400 font-medium">{label}</label>
      )}
      <textarea
        className={`bg-navy-800 border border-white/10 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 outline-none transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  );
}
