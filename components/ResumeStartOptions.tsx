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
            <div className="w-150 border border-dashed rounded-xl p-8 flex flex-col overflow-hidden items-center justify-center">
                <div className="text-sm*2">Insert existing resume for auto fill</div>
                <img src={"uploadImage.png"}
                className="h-20"
                />
                <div className="text-sm">Browse File to Upload</div>
                <div className="text-sm">Supported format Pdf , Doc , Txt</div>
            </div>
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
