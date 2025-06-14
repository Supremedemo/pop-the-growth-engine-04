
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useTemplates, UserTemplate } from "./useTemplates";
import { toast } from "sonner";
import { CanvasState } from "@/components/PopupBuilder";

interface TemplateFolder {
  id: string;
  user_id: string;
  name: string;
  parent_folder_id: string | null;
  created_at: string;
}

interface TemplateWithFolder extends UserTemplate {
  folder_id?: string;
}

export const useTemplateManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { templates, isLoading: templatesLoading } = useTemplates();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Fetch folders
  const {
    data: folders = [],
    isLoading: foldersLoading
  } = useQuery({
    queryKey: ['template-folders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('template_folders')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as TemplateFolder[];
    },
    enabled: !!user
  });

  // Create folder mutation
  const createFolderMutation = useMutation({
    mutationFn: async ({ name, parentId }: { name: string; parentId?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('template_folders')
        .insert({
          user_id: user.id,
          name,
          parent_folder_id: parentId || null
        })
        .select()
        .single();

      if (error) throw error;
      return data as TemplateFolder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-folders'] });
      toast.success('Folder created successfully!');
    },
    onError: (error) => {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  });

  // Delete folder mutation
  const deleteFolderMutation = useMutation({
    mutationFn: async (folderId: string) => {
      const { error } = await supabase
        .from('template_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-folders'] });
      toast.success('Folder deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
  });

  // Save template with canvas data
  const saveTemplateWithCanvas = useMutation({
    mutationFn: async ({ 
      name, 
      description, 
      canvasData, 
      tags, 
      folderId 
    }: {
      name: string;
      description?: string;
      canvasData: CanvasState;
      tags?: string[];
      folderId?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_templates')
        .insert({
          user_id: user.id,
          name,
          description: description || null,
          canvas_data: canvasData as any,
          tags: tags || [],
          is_public: false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('Template saved successfully!');
    },
    onError: (error) => {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    }
  });

  // Generate HTML/CSS/JS for template
  const generateTemplateCode = useCallback((canvasData: CanvasState) => {
    const html = generateHTML(canvasData);
    const css = generateCSS(canvasData);
    const js = generateJS(canvasData);
    
    return { html, css, js };
  }, []);

  const getFilteredTemplates = useCallback(() => {
    let filtered = templates;

    // Filter by tags if any are selected
    if (selectedTags.length > 0) {
      filtered = filtered.filter(template =>
        selectedTags.some(tag => template.tags.includes(tag))
      );
    }

    return filtered;
  }, [templates, selectedTags]);

  const getCurrentFolderPath = useCallback(() => {
    if (!currentFolder) return ['Root'];
    
    const path: string[] = ['Root'];
    let folder = folders.find(f => f.id === currentFolder);
    const folderPath: TemplateFolder[] = [];
    
    while (folder) {
      folderPath.unshift(folder);
      folder = folder.parent_folder_id 
        ? folders.find(f => f.id === folder!.parent_folder_id) 
        : undefined;
    }
    
    return [...path, ...folderPath.map(f => f.name)];
  }, [currentFolder, folders]);

  const getSubfolders = useCallback(() => {
    return folders.filter(f => f.parent_folder_id === currentFolder);
  }, [folders, currentFolder]);

  const getAllTags = useCallback(() => {
    return Array.from(new Set(templates.flatMap(t => t.tags)));
  }, [templates]);

  return {
    // Data
    templates: getFilteredTemplates(),
    folders,
    subfolders: getSubfolders(),
    allTags: getAllTags(),
    
    // State
    selectedTags,
    setSelectedTags,
    currentFolder,
    setCurrentFolder,
    
    // Loading states
    isLoading: templatesLoading || foldersLoading,
    isCreatingFolder: createFolderMutation.isPending,
    isDeletingFolder: deleteFolderMutation.isPending,
    isSavingTemplate: saveTemplateWithCanvas.isPending,
    
    // Actions
    createFolder: createFolderMutation.mutate,
    deleteFolder: deleteFolderMutation.mutate,
    saveTemplateWithCanvas: saveTemplateWithCanvas.mutate,
    generateTemplateCode,
    
    // Utilities
    getCurrentFolderPath
  };
};

// Helper functions to generate HTML/CSS/JS
const generateHTML = (canvasData: CanvasState): string => {
  const { elements, layout, showOverlay, overlayColor, overlayOpacity, showCloseButton, closeButtonPosition } = canvasData;
  
  const overlayStyle = showOverlay ? 
    `background-color: ${overlayColor}; opacity: ${overlayOpacity / 100};` : 'display: none;';
  
  const closeButtonHtml = showCloseButton ? 
    `<button class="popup-close-btn popup-close-${closeButtonPosition}" onclick="closePopup()">×</button>` : '';
  
  const elementsHtml = elements.map(element => {
    switch (element.type) {
      case 'text':
        return `<div class="popup-element text-element" style="left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px; z-index: ${element.zIndex};">
          <span style="font-size: ${element.fontSize}px; font-weight: ${element.fontWeight}; text-align: ${element.textAlign}; color: ${element.color};">${element.content}</span>
        </div>`;
      case 'image':
        return `<div class="popup-element image-element" style="left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px; z-index: ${element.zIndex};">
          <img src="${element.src}" alt="${element.alt}" style="width: 100%; height: 100%; object-fit: cover; border-radius: ${element.borderRadius}px;" />
        </div>`;
      case 'form':
        const fieldsHtml = element.fields.map(field => 
          `<input type="${field.type}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''} />`
        ).join('');
        return `<div class="popup-element form-element" style="left: ${element.x}px; top: ${element.y}px; width: ${element.width}px; height: ${element.height}px; z-index: ${element.zIndex};">
          <form class="popup-form">${fieldsHtml}<button type="submit" style="background-color: ${element.buttonColor};">${element.buttonText}</button></form>
        </div>`;
      default:
        return '';
    }
  }).join('');
  
  return `
    <div id="popup-overlay" class="popup-overlay" style="${overlayStyle}"></div>
    <div id="popup-container" class="popup-container popup-${layout.type}">
      ${closeButtonHtml}
      <div class="popup-content" style="width: ${canvasData.width}px; height: ${canvasData.height}px; background: ${canvasData.backgroundColor};">
        ${elementsHtml}
      </div>
    </div>
  `;
};

const generateCSS = (canvasData: CanvasState): string => {
  const { layout } = canvasData;
  
  return `
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9998;
    }
    
    .popup-container {
      position: fixed;
      z-index: 9999;
      ${layout.type === 'modal' ? 'top: 50%; left: 50%; transform: translate(-50%, -50%);' : ''}
      ${layout.type === 'banner' && layout.position === 'top' ? 'top: 0; left: 0; width: 100%;' : ''}
      ${layout.type === 'banner' && layout.position === 'bottom' ? 'bottom: 0; left: 0; width: 100%;' : ''}
      ${layout.type === 'slide-in' && layout.position === 'right' ? 'top: 50%; right: 0; transform: translateY(-50%);' : ''}
      ${layout.type === 'slide-in' && layout.position === 'left' ? 'top: 50%; left: 0; transform: translateY(-50%);' : ''}
    }
    
    .popup-content {
      position: relative;
      border-radius: 12px;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }
    
    .popup-element {
      position: absolute;
    }
    
    .popup-close-btn {
      position: absolute;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
    }
    
    .popup-close-top-right { top: -15px; right: -15px; }
    .popup-close-top-left { top: -15px; left: -15px; }
    .popup-close-bottom-right { bottom: -15px; right: -15px; }
    .popup-close-bottom-left { bottom: -15px; left: -15px; }
    
    .popup-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .popup-form input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .popup-form button {
      padding: 10px;
      border: none;
      border-radius: 4px;
      color: white;
      cursor: pointer;
    }
  `;
};

const generateJS = (canvasData: CanvasState): string => {
  return `
    function showPopup() {
      document.getElementById('popup-overlay').style.display = 'block';
      document.getElementById('popup-container').style.display = 'block';
      
      // Track popup shown event
      if (window.popupTracker) {
        window.popupTracker.track('popup_shown');
      }
    }
    
    function closePopup() {
      document.getElementById('popup-overlay').style.display = 'none';
      document.getElementById('popup-container').style.display = 'none';
      
      // Track popup closed event
      if (window.popupTracker) {
        window.popupTracker.track('popup_closed');
      }
    }
    
    // Auto-show popup based on settings (can be customized)
    document.addEventListener('DOMContentLoaded', function() {
      // Show popup after 2 seconds (customizable)
      setTimeout(showPopup, 2000);
    });
    
    // Close popup when clicking overlay
    document.getElementById('popup-overlay').addEventListener('click', closePopup);
    
    // Handle form submissions
    document.addEventListener('submit', function(e) {
      if (e.target.classList.contains('popup-form')) {
        e.preventDefault();
        
        // Track form submission
        if (window.popupTracker) {
          window.popupTracker.track('form_submitted', {
            form_data: new FormData(e.target)
          });
        }
        
        // You can add your form submission logic here
        console.log('Form submitted:', new FormData(e.target));
        
        // Close popup after submission
        closePopup();
      }
    });
  `;
};
