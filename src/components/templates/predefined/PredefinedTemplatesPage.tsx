
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomizationPanel from "./CustomizationPanel";
import LivePreview from "./LivePreview";
import TemplateExporter from "./TemplateExporter";
import { predefinedTemplates } from "./templatesData";
import { LucideTemplateIcon } from "./LucideTemplateIcon";

const categories = [
  { label: "Lead Generation", value: "Lead Generation" },
  { label: "E-commerce", value: "E-commerce" },
  { label: "Mobile-First", value: "Mobile-First" },
  { label: "Holiday/Seasonal", value: "Holiday/Seasonal" },
  { label: "B2B", value: "B2B" },
];

const PredefinedTemplatesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].value);
  const filteredTemplates = predefinedTemplates.filter(
    (t) => t.category === selectedCategory
  );
  const [activeTemplateId, setActiveTemplateId] = useState(
    filteredTemplates[0]?.id || ""
  );

  React.useEffect(() => {
    if (!filteredTemplates.find((tpl) => tpl.id === activeTemplateId)) {
      setActiveTemplateId(filteredTemplates[0]?.id || "");
    }
  }, [selectedCategory]);

  const selectedTemplate =
    filteredTemplates.find((tpl) => tpl.id === activeTemplateId) ||
    filteredTemplates[0] ||
    null;

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Predefined Templates</h2>
          <p className="text-slate-600 text-sm">
            Pick a ready-made template, then customize the details to your brand needs.
          </p>
        </div>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="flex bg-slate-100 rounded-lg space-x-1">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className={`px-3 py-1 rounded-full ${selectedCategory === cat.value ? "bg-white text-slate-900" : "text-slate-600 hover:bg-slate-200"}`}
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </header>

      {/* Main content: 3-column layout */}
      <main className="flex-1 flex flex-col md:flex-row gap-2">
        {/* Template List */}
        <section className="w-full md:w-1/4 bg-white border-r min-h-full overflow-y-auto p-4">
          <h3 className="font-semibold mb-2 text-slate-800 text-xs uppercase tracking-wide">
            Templates
          </h3>
          <ul className="space-y-3">
            {filteredTemplates.length === 0 && (
              <li className="text-gray-400 text-center text-sm">No templates yet</li>
            )}
            {filteredTemplates.map((tpl) => (
              <li
                key={tpl.id}
                role="button"
                aria-selected={activeTemplateId === tpl.id}
                onClick={() => setActiveTemplateId(tpl.id)}
                className={`group cursor-pointer rounded-lg border p-3 hover:shadow transition hover:bg-slate-50 
                  flex gap-3 items-center ${
                    activeTemplateId === tpl.id
                      ? "ring-2 ring-primary/30 bg-slate-50"
                      : ""
                  }`}
                tabIndex={0}
              >
                <div className={`bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center transition-all text-slate-500 group-hover:bg-primary/10`}>
                  <LucideTemplateIcon icon={tpl.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 truncate">{tpl.name}</div>
                  <div className="text-xs text-slate-600 truncate">{tpl.description}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {/* Live Preview (center area) */}
        <section className="flex-1 flex flex-col min-h-0">
          <LivePreview template={selectedTemplate} />
          <TemplateExporter template={selectedTemplate} />
        </section>
        {/* Customization Panel (side) */}
        <aside className="hidden md:block w-80 bg-white border-l min-h-full">
          <CustomizationPanel template={selectedTemplate} />
        </aside>
      </main>
    </div>
  );
};

export default PredefinedTemplatesPage;
