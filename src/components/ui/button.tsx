import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl focus:ring-blue-500":
              variant === "primary",
            "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm focus:ring-gray-300":
              variant === "secondary",
            "text-gray-600 hover:bg-gray-100 hover:text-gray-900":
              variant === "ghost",
            "border-2 border-blue-600 text-blue-600 hover:bg-blue-50":
              variant === "outline",
            "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500":
              variant === "danger",
          },
          {
            "px-3 py-1.5 text-sm gap-1.5": size === "sm",
            "px-4 py-2 text-sm gap-2": size === "md",
            "px-6 py-3 text-base gap-2": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };
