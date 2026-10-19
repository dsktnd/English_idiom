import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({
  hover = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const base =
    "bg-navy-700/50 border border-white/10 rounded-xl overflow-hidden";
  const hoverStyles = hover
    ? "hover:border-cyan-400/30 hover:shadow-lg hover:shadow-cyan-400/5 transition-all cursor-pointer"
    : "";

  return (
    <div className={`${base} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}
