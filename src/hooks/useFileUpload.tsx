
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface UploadedFile {
  id: string;
  filename: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  folder_path: string;
  created_at: string;
  url: string;
}

export const useFileUpload = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadMutation = useMutation({
    mutationFn: async ({ file, folderPath = '/' }: {
      file: File;
      folderPath?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Generate unique filename
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}_${sanitizedName}`;
      const storagePath = `${user.id}${folderPath}${filename}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(storagePath);

      // Save metadata to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('user_uploads')
        .insert({
          user_id: user.id,
          filename,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          storage_path: storagePath,
          folder_path: folderPath
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        ...fileRecord,
        url: publicUrl
      } as UploadedFile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      toast.success('File uploaded successfully!');
      setUploadProgress(0);
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      setUploadProgress(0);
    }
  });

  const uploadFile = async (file: File, folderPath?: string) => {
    setUploadProgress(10);
    return uploadMutation.mutateAsync({ file, folderPath });
  };

  return {
    uploadFile,
    isUploading: uploadMutation.isPending,
    uploadProgress
  };
};
