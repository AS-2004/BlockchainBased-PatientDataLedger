import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover = ({ children, open, onOpenChange }: PopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <div className="relative inline-block">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === PopoverTrigger) {
            return React.cloneElement(child, { 
              onClick: () => handleOpenChange(!isOpen),
              isOpen: open !== undefined ? open : isOpen 
            });
          }
          if (child.type === PopoverContent) {
            return (open !== undefined ? open : isOpen) ? child : null;
          }
        }
        return child;
      })}
    </div>
  );
};

interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  isOpen?: boolean;
}

const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ className, children, asChild, isOpen, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        ref,
        className: cn(children.props.className, className)
      });
    }

    return (
      <button
        ref={ref}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }
);
PopoverTrigger.displayName = "PopoverTrigger";

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
}

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, children, align = "center", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-2 rounded-md border border-primary-200 bg-white shadow-lg animate-in fade-in-80 slide-in-from-top-1",
          align === "start" && "left-0",
          align === "center" && "left-1/2 transform -translate-x-1/2",
          align === "end" && "right-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent };