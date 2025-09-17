"use client";

import { useState } from "react";
import Loader from "./ui/Loader";

function extractPersonalDetails(lines: string[]) {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phoneRegex = /(\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/;

  const email = lines.find(l => emailRegex.test(l)) || "";
  const phone = lines.find(l => phoneRegex.test(l)) || "";
  const linkedin = lines.find(l => l.toLowerCase().includes("linkedin")) || "";
  const github = lines.find(l => l.toLowerCase().includes("github")) || "";

  return {
    name: lines[0] || "",
    email,
    phone,
    linkedin,
    github,
    location: "",
    country: "",
  };
}

export interface ResumeStartOptionsProps {
  onUpload: (file: File) => void;
  onManual: () => void;
  loading: boolean
}

export default function ResumeStartOptions({
  onUpload,
  onManual,
  loading
}: ResumeStartOptionsProps) {

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpload(file);
      e.target.value = '';
    }
  }

  return (
    <main className="bg-background flex justify-center px-4 py-8">
      <section
        aria-label="Resume start options"
        className="w-full sm:max-w-3xl rounded-xl border-border bg-card  text-primary-foreground shadow-sm p-6 md:p-8"
      >
        <header className="text-center">
          <h1 className="text-xl font-semibold text-center">
            Welcome to Smart Resume Builder 🚀
          </h1>
          <p className="text-sm md:text-base text-muted">
            How would you like to get started?
          </p>
        </header>

        <div className="mt-6 flex flex-col justify-between">
          <div className="flex flex-col items-center justify-between gap-6">
            <label
              htmlFor="file"
              className="w-full sm:w-[380px] border hover:cursor-pointer border-dashed rounded-xl p-6 sm:p-8 flex flex-col overflow-hidden items-center justify-center"
            >
              {
                loading ? (
                  <div className="flex flex-col gap-4 items-center justify-center min-h-[120px]">
                    <Loader size="3" />
                    <div className="text-lg sm:text-xl text-center">Please Wait we extract your information</div>
                  </div>
                ) : (
                  <>
                    <div className="text-sm sm:text-base text-center">Upload existing resume for auto fill</div>
                    <img
                      src={"uploadImage.png"}
                      className="h-16 sm:h-20"
                      alt="upload"
                    />
                    <div className="text-sm text-center">Browse File to Upload</div>
                    <div className="text-sm text-center">Supported format Pdf , Doc , Txt</div>
                  </>
                )
              }
            </label>

            <input
              className="hidden"
              type="file"
              accept=".pdf,.doc,.docx,.txt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              onChange={handleFileChange}
              id="file"
            />

            <button
              type="button"
              onClick={onManual}
              aria-label="Fill information manually"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-3 font-medium transition-colors hover:cursor-pointer mb-4 text-sm"
            >
              {"✍️ Fill Information Manually"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
