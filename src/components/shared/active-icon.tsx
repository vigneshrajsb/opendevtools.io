import { Circle } from "lucide-react";

interface ActiveIconProps {
  active: boolean;
  className?: string;
}

export function ActiveIcon({ active, className }: ActiveIconProps) {
  if (!active) return null;

  return (
    <Circle
      className={`size-[6px] mr-1 fill-green-500 text-green-500 ${className ?? ""}`}
    />
  );
}
