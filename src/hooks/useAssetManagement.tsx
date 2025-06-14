
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useFileUpload, UploadedFile } from "./useFileUpload";
import { toast } from "sonner";

interface AssetFolder {
  path: string;
  name: string;
  created_at: string;
}

export const useAssetManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { uploadFile, isUploading } = useFileUpload();
  
  const [currentAssetFolder, setCurrentAssetFolder] = useState<string>('/');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  // Fetch user uploads
  const {
    data: assets = [],
    isLoading
  } = useQuery({
    queryKey: ['user-uploads', user?.id, currentAssetFolder],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_uploads')
        .select('*')
        .eq('folder_path', currentAssetFolder)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(upload => ({
        ...upload,
        url: supabase.storage.from('user-uploads').getPublicUrl(upload.storage_path).data.publicUrl
      })) as (UploadedFile & { url: string })[];
    },
    enabled: !!user
  });

  // Get unique folders
  const {
    data: assetFolders = [],
  } = useQuery({
    queryKey: ['asset-folders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_uploads')
        .select('folder_path, created_at')
        .neq('folder_path', '/')
        .order('folder_path', { ascending: true });

      if (error) throw error;
      
      // Get unique folders
      const uniqueFolders = Array.from(
        new Set(data.map(item => item.folder_path))
      ).map(path => ({
        path,
        name: path.split('/').filter(Boolean).pop() || '',
        created_at: data.find(item => item.folder_path === path)?.created_at || ''
      }));
      
      return uniqueFolders as AssetFolder[];
    },
    enabled: !!user
  });

  // Delete asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: string) => {
      const asset = assets.find(a => a.id === assetId);
      if (!asset) throw new Error('Asset not found');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-uploads')
        .remove([asset.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_uploads')
        .delete()
        .eq('id', assetId);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-uploads'] });
      toast.success('Asset deleted successfully!');
      setSelectedAssets(prev => prev.filter(id => !prev.includes(id)));
    },
    onError: (error) => {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    }
  });

  // Move asset mutation
  const moveAssetMutation = useMutation({
    mutationFn: async ({ assetId, newFolderPath }: { assetId: string; newFolderPath: string }) => {
      const asset = assets.find(a => a.id === assetId);
      if (!asset) throw new Error('Asset not found');

      // Generate new storage path
      const newStoragePath = `${user!.id}${newFolderPath}${asset.filename}`;

      // Move file in storage
      const { error: moveError } = await supabase.storage
        .from('user-uploads')
        .move(asset.storage_path, newStoragePath);

      if (moveError) throw moveError;

      // Update database
      const { error: dbError } = await supabase
        .from('user_uploads')
        .update({
          folder_path: newFolderPath,
          storage_path: newStoragePath
        })
        .eq('id', assetId);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['asset-folders'] });
      toast.success('Asset moved successfully!');
    },
    onError: (error) => {
      console.error('Error moving asset:', error);
      toast.error('Failed to move asset');
    }
  });

  // Bulk operations
  const deleteSelectedAssets = useCallback(async () => {
    if (selectedAssets.length === 0) return;
    
    try {
      await Promise.all(
        selectedAssets.map(assetId => deleteAssetMutation.mutateAsync(assetId))
      );
      setSelectedAssets([]);
    } catch (error) {
      console.error('Error deleting selected assets:', error);
    }
  }, [selectedAssets, deleteAssetMutation]);

  const moveSelectedAssets = useCallback(async (newFolderPath: string) => {
    if (selectedAssets.length === 0) return;
    
    try {
      await Promise.all(
        selectedAssets.map(assetId => 
          moveAssetMutation.mutateAsync({ assetId, newFolderPath })
        )
      );
      setSelectedAssets([]);
    } catch (error) {
      console.error('Error moving selected assets:', error);
    }
  }, [selectedAssets, moveAssetMutation]);

  // Enhanced upload with folder support
  const uploadAsset = useCallback(async (file: File, folderPath: string = currentAssetFolder) => {
    try {
      const uploadedFile = await uploadFile(file, folderPath);
      queryClient.invalidateQueries({ queryKey: ['user-uploads'] });
      queryClient.invalidateQueries({ queryKey: ['asset-folders'] });
      return uploadedFile;
    } catch (error) {
      console.error('Error uploading asset:', error);
      throw error;
    }
  }, [uploadFile, currentAssetFolder, queryClient]);

  const getAssetsByType = useCallback((type: string) => {
    return assets.filter(asset => asset.mime_type.startsWith(type));
  }, [assets]);

  const getAssetUrl = useCallback((storagePath: string) => {
    return supabase.storage.from('user-uploads').getPublicUrl(storagePath).data.publicUrl;
  }, []);

  return {
    // Data
    assets,
    assetFolders,
    images: getAssetsByType('image'),
    videos: getAssetsByType('video'),
    documents: getAssetsByType('application'),
    
    // State
    currentAssetFolder,
    setCurrentAssetFolder,
    selectedAssets,
    setSelectedAssets,
    
    // Loading states
    isLoading,
    isUploading,
    isDeleting: deleteAssetMutation.isPending,
    isMoving: moveAssetMutation.isPending,
    
    // Actions
    uploadAsset,
    deleteAsset: deleteAssetMutation.mutate,
    moveAsset: moveAssetMutation.mutate,
    deleteSelectedAssets,
    moveSelectedAssets,
    
    // Utilities
    getAssetUrl,
    getAssetsByType
  };
};
