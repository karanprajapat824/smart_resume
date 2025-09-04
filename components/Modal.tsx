"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  message: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export default function Modal({
  isOpen,
  message,
  description,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-xl shadow-lg max-w-lg w-full max-h-70 h-full p-6 text-center flex flex-col justify-around items-center text-primary-foreground">
        <h2 className="text-xl text-primary font-bold mb-2">{message}</h2>
        <p className="text-primary-foreground mb-6">{description}</p>
        <div className="flex justify-around gap-10">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition hover:cursor-pointer min-w-30"
            onClick={onPrimaryClick}
          >
            {primaryButtonText}
          </button>
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition hover:cursor-pointer min-w-30"
            onClick={onSecondaryClick}
          >
            {secondaryButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
