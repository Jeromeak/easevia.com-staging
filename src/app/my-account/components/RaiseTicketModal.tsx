'use client';
import { DocumentClickIcon, DocumentIcon } from '@/icons/icon';
import { useRef, useState, useCallback } from 'react';
import { Modal } from '@/app/authentication/components/Modal';
import { InputBox } from '@/app/authentication/components/Input';

interface RaiseTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RaiseTicketModal: React.FC<RaiseTicketModalProps> = ({ isOpen, onClose }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setUploadedFile(file);
    }
  }, []);

  const handleUploadClick = useCallback(() => fileInputRef.current?.click(), []);
  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleClose = useCallback(() => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    handleClose();
  }, [handleClose]);

  console.log('Current uploadedFile state:', uploadedFile);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="dark:!bg-[#0d0d0d] z-100">
      <div className="rounded-lg  mx-auto py-6 px-6">
        <div className="text-neutral-50 dark:text-white text-center text-[28px] font-semibold tracking-wide mb-1 uppercase">
          RAISE TICKET
        </div>
        <p className="text-[#8E8E8E] text-center text-xl font-normal leading-[120%] mb-8">
          We’re here to assist you if you need help.
        </p>

        <div className="space-y-5">
          <div>
            <InputBox label="TICKET TITLE*" placeholder="Enter a title for your ticket" />
          </div>
          <div>
            <InputBox label="WHAT IS THIS REGARDING?" placeholder="What is this regarding?" />
          </div>

          <div>
            <label className="block text-base font-medium dark:text-white mb-2">DESCRIBE YOUR ISSUE</label>
            <textarea
              rows={4}
              className="w-full rounded-xl dark:border-[1.5px] border-[#171717] bg-inputcolor dark:bg-[#1D1D1D] flex p-3 items-center gap-3 text-neutral-50 dark:text-white text-base font-normal leading-6 placeholder-[#8E8E8E] focus:outline-none focus:border-[#00A6A6] flex-1"
              placeholder="Enter a detailed description of your issue"
            ></textarea>
          </div>

          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <div
              onClick={handleUploadClick}
              className="rounded-[8.66px] border border-dashed border-[#4D5461] flex py-[10px] px-5 items-center gap-4 cursor-pointer hover:border-[#00A6A6] transition-all duration-300"
            >
              <DocumentClickIcon className="w-6 h-6 flex-shrink-0" width="24" height="24" />
              <p className="text-sm text-white">
                <span className="font-medium text-[#009898]">Click here</span> to upload files here
              </p>
            </div>
            <div className="flex py-[11px] px-4 items-center gap-3 rounded-lg bg-[#E6F2F2] dark:bg-[#171717]">
              <div className="flex items-center gap-3">
                <DocumentIcon width="24" height="24" className="text-[#00A6A6] w-6 h-6 flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <p className="text-neutral-50 dark:text-white text-sm">
                    {uploadedFile ? uploadedFile.name : 'No file selected'}
                  </p>
                  <span className="text-[#00A6A6] text-sm font-medium">• Preview</span>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={handleRemoveFile}
                  className="text-[#8E8E8E] cursor-pointer hover:text-red-400 text-sm w-5 h-5 flex items-center justify-center"
                  disabled={!uploadedFile}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-7">
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 cursor-pointer bg-[#00A6A6] text-white rounded-full hover:bg-[#007777] text-sm font-medium uppercase duration-300"
          >
            CREATE TICKET
          </button>
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 border cursor-pointer border-[#00A6A6] text-[#00A6A6] rounded-full hover:bg-[#00A6A6] hover:text-white text-sm font-medium uppercase duration-300"
          >
            CANCEL
          </button>
        </div>
      </div>
    </Modal>
  );
};
