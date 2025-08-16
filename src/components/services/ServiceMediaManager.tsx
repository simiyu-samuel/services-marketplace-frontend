import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Service } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { showSuccess, showError } from "@/utils/toast";
import { Upload } from "lucide-react";

interface ServiceMediaManagerProps {
  service: Service;
}

const uploadMedia = async ({ id, formData }: { id: number, formData: FormData }) => {
  const { data } = await api.post(`/services/${id}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.service;
};

const ServiceMediaManager = ({ service }: ServiceMediaManagerProps) => {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: uploadMedia,
    onSuccess: () => {
      showSuccess("Media uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ['service', service.id] });
      setSelectedFiles(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || "Failed to upload media.");
    },
  });

  const handleUpload = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      showError("Please select files to upload.");
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('media_files[]', selectedFiles[i]);
    }
    mutation.mutate({ id: service.id, formData });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Media</CardTitle>
        <CardDescription>View existing media and upload new files for this service.</CardDescription>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold mb-2">Current Media</h4>
        {service.media_files && service.media_files.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {service.media_files.map((url, index) => (
              <div key={index} className="aspect-square bg-muted rounded-md overflow-hidden">
                <img src={url} alt={`Service media ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No media files have been uploaded yet.</p>
        )}
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Upload New Media</h4>
          <Input 
            type="file" 
            multiple 
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={(e) => setSelectedFiles(e.target.files)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} disabled={mutation.isPending || !selectedFiles}>
          <Upload className="mr-2 h-4 w-4" />
          {mutation.isPending ? "Uploading..." : "Upload Files"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceMediaManager;