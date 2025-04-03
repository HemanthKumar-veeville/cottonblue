import * as React from "react";

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  checked?: boolean;
}

const Switch = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <div
    ref={ref}
    className={`inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
      checked ? "border-transparent" : "border-input"
    } ${className || ""}`}
    onClick={() => onCheckedChange?.(!checked)}
    {...props}
  >
    <svg
      width={24}
      height={24}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-opacity duration-200 ${
        checked ? "opacity-100" : "opacity-0"
      }`}
    >
      <g id="Icon">
        <path
          id="Vector"
          d="M7.5 9.16667L10 11.6667L18.3333 3.33333M17.5 10V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H13.3333"
          stroke="#10B981"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  </div>
));
Switch.displayName = "Switch";

export { Switch };
