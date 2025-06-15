
import React from "react";
import type { PredefinedTemplate } from "./templatesData";

const CustomizationPanel = ({
  template,
}: {
  template: PredefinedTemplate | null;
}) => {
  // For now, display config JSON; later, build actual controls by config type/field.
  return (
    <aside className="w-80 bg-white shadow-lg border-l p-4 h-full flex flex-col">
      <div className="font-semibold text-slate-800 mb-2">Customization</div>
      {!template && (
        <div className="text-gray-400 text-center">No template selected</div>
      )}
      {!!template && (
        <>
          <div className="mb-2 text-sm text-slate-700">{template.name}</div>
          <div className="bg-slate-50 rounded p-2 text-xs font-mono max-h-64 overflow-auto border">
            {JSON.stringify(template.config, null, 2)}
          </div>
          {/* Future: Controls for each config property */}
        </>
      )}
    </aside>
  );
};

export default CustomizationPanel;
