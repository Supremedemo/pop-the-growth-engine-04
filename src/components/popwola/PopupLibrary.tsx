
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Plus, LayoutTemplate } from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded mr-1">{children}</span>
);

export default function PopupLibrary({ onCreateNew, onEditTemplate }: {
  onCreateNew?: () => void;
  onEditTemplate?: (templateId: string) => void;
}) {
  const { templates, isLoading } = useTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-primary" />
            Popup Library
          </h2>
          <p className="text-slate-600 text-sm">
            Manage, preview and create popup & modal templates for your site.
          </p>
        </div>
        <Button onClick={onCreateNew} variant="default" className="gap-2">
          <Plus className="w-4 h-4" />
          New Popup
        </Button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto py-8 px-4">
        {isLoading ? (
          <div className="text-center text-slate-500">Loading templates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.length === 0 ? (
              <div className="col-span-full text-center text-slate-400">No popups yet. Click "New Popup" to create one!</div>
            ) : (
              templates.map(tpl => (
                <Card
                  key={tpl.id}
                  className={`transition-all cursor-pointer hover:shadow-lg ${selectedTemplateId === tpl.id ? "ring-2 ring-primary" : "hover:bg-primary/5"}`}
                  onClick={() => setSelectedTemplateId(tpl.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 truncate text-lg">{tpl.name}</span>
                      </div>
                      <div className="text-xs text-slate-500 mb-1 truncate">
                        {tpl.description || <span className="italic text-slate-300">No description</span>}
                      </div>
                      <div className="flex flex-wrap mb-1">
                        {(tpl.tags ?? []).map((tag: string) => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="secondary" onClick={e => {
                          e.stopPropagation();
                          if (onEditTemplate) onEditTemplate(tpl.id);
                        }}>
                          <Eye className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {/* Add more actions here (duplicate, export, etc) */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
