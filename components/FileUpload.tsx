'use client';

import React, { useRef } from 'react';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ file, onFileSelect, error }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const validateAndSelect = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      alert('File type not supported — please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File exceeds 5MB maximum size limit.');
      return;
    }
    onFileSelect(selectedFile);
  };

  return (
    <div className="w-full">
      <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#1C1B19] mb-2">
        Upload Resume <span className="font-normal opacity-60">(PDF or DOCX, Max 5MB)</span>
      </label>

      {!file ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-[#1C1B19]/30 hover:border-[#1C1B19] bg-[#F7F5F0] transition-colors rounded-none p-6 sm:p-8 cursor-pointer text-center flex flex-col items-center justify-center min-h-[180px]"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && validateAndSelect(e.target.files[0])}
          />
          <p className="font-serif text-base text-[#1C1B19] font-medium mb-1">
            Drag and drop resume here, or <span className="underline underline-offset-4 font-bold">browse</span>
          </p>
          <p className="font-mono text-xs text-[#1C1B19]/60">Supports PDF & DOCX up to 5MB</p>
        </div>
      ) : (
        <div className="border border-[#1C1B19] bg-[#F7F5F0] p-4 flex items-center justify-between rounded-none shadow-sm">
          <div>
            <p className="font-serif font-bold text-sm text-[#1C1B19] truncate max-w-[280px]">
              {file.name}
            </p>
            <p className="font-mono text-xs text-[#1C1B19]/60 mt-0.5">
              {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for manuscript review
            </p>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="font-mono text-xs font-bold text-[#8B2E2E] hover:underline px-2 py-1"
          >
            Remove file
          </button>
        </div>
      )}

      {error && (
        <p className="font-mono text-xs text-[#8B2E2E] mt-2 font-semibold">{error}</p>
      )}
    </div>
  );
};
