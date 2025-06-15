
import React from "react";
import { LucideTemplateIcon } from "./LucideTemplateIcon";
import type { PredefinedTemplate } from "./templatesData";

const Label = ({ title }: { title: string }) => (
  <span className="uppercase text-xs font-semibold text-slate-500 tracking-wide">{title}</span>
);

const FeatureBadge = ({ feature }: { feature: string }) => (
  <span className="bg-slate-100 rounded-full px-3 py-1 text-xs text-slate-700 mr-2 mb-1 inline-block">
    {feature}
  </span>
);

const TagBadge = ({ tag }: { tag: string }) => (
  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded mx-0.5 text-xs">{tag}</span>
);

const ConfigList = ({ config }: { config: any }) => {
  if (!config) return null;
  return (
    <div className="text-xs mt-2">
      {Object.entries(config).map(([k, v]) => (
        <div key={k} className="flex space-x-2">
          <span className="min-w-[100px] text-slate-500">{k}:</span>
          <span className="text-slate-900">
            {typeof v === "object" ? JSON.stringify(v) : String(v)}
          </span>
        </div>
      ))}
    </div>
  );
};

const LivePreview = ({
  template,
}: {
  template: PredefinedTemplate | null;
}) => {
  if (!template) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 border p-4">
        <div className="text-gray-400">Select a template to preview</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-white border-b rounded-b-lg shadow-sm overflow-hidden animate-fade-in">
      <div className="flex-1 flex items-center justify-center py-8 px-12 bg-gradient-to-br from-slate-50 to-white">
        <div className="relative w-full max-w-xs mx-auto min-h-[320px] flex flex-col items-center">
          <div className="bg-white shadow-lg rounded-xl p-4 w-52 h-52 flex items-center justify-center border mb-4">
            <img
              src={template.previewImage || "/placeholder.svg"}
              alt={template.name}
              className="block object-contain w-full h-full rounded-md"
              onError={e => (e.currentTarget.src = "/placeholder.svg")}
            />
            <div className="absolute -top-3 -right-3 bg-primary flex items-center justify-center rounded-full w-8 h-8 shadow text-white border-4 border-white">
              <LucideTemplateIcon icon={template.icon} className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-wrap">
            {template.tags.map(tag => (
              <TagBadge tag={tag} key={tag} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-[260px] max-w-md py-6 px-8 flex flex-col justify-center">
        <Label title="Template" />
        <h2 className="text-2xl font-bold mb-2 text-slate-900">{template.name}</h2>
        <div className="text-slate-700 mb-3">{template.description}</div>
        <Label title="Features" />
        <div className="flex flex-wrap mb-4">
          {template.features.map(feature => (
            <FeatureBadge feature={feature} key={feature} />
          ))}
        </div>
        <Label title="Configuration" />
        <ConfigList config={template.config} />
        {/* Add more interactive preview here in the future */}
      </div>
    </div>
  );
};

export default LivePreview;
