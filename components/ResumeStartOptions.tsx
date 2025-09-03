"use client";

export interface ResumeStartOptionsProps {
  onUpload: () => void;
  onManual: () => void;
}

export default function ResumeStartOptions({
  onUpload,
  onManual,
}: ResumeStartOptionsProps) {
  return (
    <main className="min-h-screen bg-background flex justify-center p-4 pt-10">
      <section
        aria-label="Resume start options"
        className="w-[80%] rounded-xl border-border bg-card text-primary-foreground shadow-sm p-6 h-130 md:p-8"
      >
        <header className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold">
            Welcome to Smart Resume Builder 🚀
          </h1>
          <p className="mt-2 text-sm md:text-base text-muted">
            How would you like to get started?
          </p>
        </header>

        <div className="mt-6 grid gap-3 h-100">
          <div className="flex flex-col items-center justify-around">
            <div className="border border-dashed rounded-xl w-full h-75 flex flex-col overflow-hidden items-center justify-center">
                <img src={"uploadImage.png"}
                className="h-50"
                />
                <div className="">Browse File to Upload</div>
                <div>Supported format Pdf , Doc , Txt</div>
            </div>
            <button
              type="button"
              onClick={onManual}
              aria-label="Fill information manually"
              className="w-[30%] inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-3 font-medium transition-colors hover:cursor-pointer mb-4"
            >
              {"✍️ Fill Information Manually"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
