
import React from "react";
import {
  CircleCheck,
  CircleMinus,
  CirclePlus,
  ColorPicker,
  Image as ImageIcon,
  Pencil,
  PencilLine,
  Plus,
  Undo,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  "circle-check": CircleCheck,
  "circle-minus": CircleMinus,
  "circle-plus": CirclePlus,
  "color-picker": ColorPicker,
  "image": ImageIcon,
  "pencil": Pencil,
  "pencil-line": PencilLine,
  "plus": Plus,
  "undo": Undo,
  "arrow-down": ArrowDown,
  "arrow-up": ArrowUp,
};

export function LucideTemplateIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = iconMap[icon] ?? Plus;
  return <Icon className={className} />;
}
