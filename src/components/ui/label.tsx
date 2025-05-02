import * as React from "react";

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className = "", htmlFor }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  )
);

Label.displayName = "Label";

export { Label };
