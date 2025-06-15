
import React from "react";
import {
  CircleCheck,
  CircleMinus,
  CirclePlus,
  Image as ImageIcon,
  Pencil,
  PencilLine,
  Plus,
  Undo,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

// ColorPicker has been removed (it is not in the allowed/exported icons)

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  "circle-check": CircleCheck,
  "circle-minus": CircleMinus,
  "circle-plus": CirclePlus,
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
