import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = 32,
  text = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Loader2
          size={size}
          className="animate-spin text-primary"
        />
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
      </div>
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}
