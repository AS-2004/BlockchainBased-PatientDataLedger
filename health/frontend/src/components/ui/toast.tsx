import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  onClose?: () => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, variant = "default", onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
          {
            "border-primary-200 bg-white": variant === "default",
            "border-red-200 bg-red-50": variant === "destructive",
          },
          className
        )}
        {...props}
      >
        <div className="grid gap-1">
          {title && (
            <div className={cn(
              "text-sm font-semibold",
              variant === "destructive" ? "text-red-800" : "text-gray-800"
            )}>
              {title}
            </div>
          )}
          {description && (
            <div className={cn(
              "text-sm opacity-90",
              variant === "destructive" ? "text-red-700" : "text-gray-600"
            )}>
              {description}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-gray-600 focus:opacity-100 group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = "Toast"

export { Toast }

export const useToast = () => {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...props, onClose: () => removeToast(id) }])
    setTimeout(() => removeToast(id), 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter((_, index) => index.toString() !== id))
  }, [])

  return { toast, toasts }
}