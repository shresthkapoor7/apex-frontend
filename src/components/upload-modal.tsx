"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { uploadDocument } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface UploadModalProps {
  onSuccess?: () => void;
}

export function UploadModal({ onSuccess }: UploadModalProps) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      setOpen(false);
      setProgress(0);
      onSuccess?.();
    },
  });

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setProgress(10);
      try {
        setProgress(30);
        await uploadMutation.mutateAsync(file);
        setProgress(100);
      } catch {
        setProgress(0);
      }
    },
    [uploadMutation]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
          <DialogDescription>
            Upload a PDF to analyze and extract deal metrics.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-border rounded-md cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <input
              id="file-upload"
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploadMutation.isPending}
            />
            <span className="text-sm text-muted-foreground">
              {uploadMutation.isPending ? "Uploading..." : "Click to select PDF"}
            </span>
          </label>
          {(uploadMutation.isPending || progress > 0) && (
            <div className="space-y-2">
              <Progress value={uploadMutation.isPending ? 60 : progress} />
              {uploadMutation.isError && (
                <p className="text-sm text-destructive">
                  {(uploadMutation.error as Error).message}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
