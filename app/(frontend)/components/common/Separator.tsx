interface SeparatorProps {
  /**
   * Orientation of the separator
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * Optional custom class name
   */
  className?: string;

  /**
   * Color of the separator
   * @default "#E4E4E7"
   */
  color?: string;

  /**
   * Thickness of the separator in pixels
   * @default 1
   */
  thickness?: number;
}

export default function Separator({
  orientation = "horizontal",
  className = "",
  color = "#E4E4E7",
  thickness = 1,
}: SeparatorProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={className || (isHorizontal ? "w-full" : "h-full")}
      style={{
        backgroundColor: color,
        [isHorizontal ? "height" : "width"]: `${thickness}px`,
      }}
      role="separator"
      aria-orientation={orientation}
    />
  );
}

export type { SeparatorProps };
