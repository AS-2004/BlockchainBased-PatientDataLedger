import * as React from "react"
import { cn } from "@/lib/utils"

// Context for managing radio group state
const RadioGroupContext = React.createContext(null);

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  name?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value, onValueChange, name, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const groupName = name || `radio-group-${React.useId()}`;

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    // Update internal value when prop changes
    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    return (
      <RadioGroupContext.Provider value={{
        value: internalValue,
        onValueChange: handleValueChange,
        name: groupName
      }}>
        <div className={cn("grid gap-2", className)} {...props} ref={ref}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value: string
  id?: string
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const itemId = id || `radio-${value}-${React.useId()}`;
    
    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup");
    }

    return (
      <input
        type="radio"
        id={itemId}
        name={context.name}
        value={value}
        checked={context.value === value}
        onChange={() => context.onValueChange(value)}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary-300 text-primary-600 shadow focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

// Helper component for better UX with labels
const RadioGroupItemWithLabel = React.forwardRef<
  HTMLInputElement,
  RadioGroupItemProps & { label: string; description?: string }
>(({ value, label, description, className, ...props }, ref) => {
  const itemId = `radio-${value}-${React.useId()}`;
  
  return (
    <div className="flex items-start space-x-3">
      <RadioGroupItem
        ref={ref}
        value={value}
        id={itemId}
        className={className}
        {...props}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor={itemId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
});
RadioGroupItemWithLabel.displayName = "RadioGroupItemWithLabel";

export { RadioGroup, RadioGroupItem, RadioGroupItemWithLabel};