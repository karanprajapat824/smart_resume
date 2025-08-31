export default function LivePreview() {
  return (
    <div className="space-y-4 h-fit sticky top-[-25]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Live Preview</h2>
      </div>
      <div className="bg-card rounded-lg p-6 min-h-[100vh] min-w-150"></div>
    </div>
  );
}
