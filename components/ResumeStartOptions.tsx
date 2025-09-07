"use client";

import { useState } from "react";
import { URL } from "@/app/page";
import { ResumeData } from "@/app/create-resume/page";
import Loader from "./Loader";


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
}

export default function ResumeStartOptions({
  onUpload,
  onManual,
}: ResumeStartOptionsProps) {
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpload(file);
      setLoading(true);
    }
  }


  return (
    <main className="bg-background flex justify-center p-15">
      <section
        aria-label="Resume start options"
        className="w-200 rounded-xl border-border bg-card text-primary-foreground shadow-sm p-6 h-100 md:p-8"
      >
        <header className="text-center">
          <h1 className="text-xl font-semibold">
            Welcome to Smart Resume Builder 🚀
          </h1>
          <p className="text-sm md:text-base text-muted">
            How would you like to get started?
          </p>
        </header>

        <div className="mt-6 flex flex-col h-70 justify-between">
          <div className="flex flex-col items-center justify-between h-full gap-8">
            <label htmlFor="file" className="w-150 border hover:cursor-pointer border-dashed rounded-xl p-8 flex flex-col overflow-hidden items-center justify-center">
              {
                loading ?
                  <div className="flex flex-col gap-6 h-40 items-center justify-center">
                    <Loader size="3" />
                    <div className="text-xl">Please Wait we extract yout information</div>
                  </div> : <>
                    <div className="text-sm*2">Upload existing resume for auto fill</div>
                    <img src={"uploadImage.png"}
                      className="h-20"
                    />
                    <div className="text-sm">Browse File to Upload</div>
                    <div className="text-sm">Supported format Pdf , Doc , Txt</div>
                  </>
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
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-3 font-medium transition-colors hover:cursor-pointer mb-4 text-sm"
            >
              {"✍️ Fill Information Manually"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
