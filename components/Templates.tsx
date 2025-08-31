import resumeTemplate1 from "@/public/resume-template-1.webp";
import resumeTemplate2 from "@/public/resume-template-2.webp";
import resumeTemplate3 from "@/public/resume-template-3.jpg";
import resumeTemplate4 from "@/public/resume-template-4.webp";
import Image from "next/image";

const templates = [
  {
    id: 1,
    name: "Professional Classic",
    description: "Clean and ATS-friendly design",
    image: resumeTemplate1,
    category: "Professional"
  },
  {
    id: 2,
    name: "Creative Sidebar",
    description: "Modern layout with color accents",
    image: resumeTemplate2,
    category: "Creative"
  },
  {
    id: 3,
    name: "Executive Minimal",
    description: "Sophisticated and elegant style",
    image: resumeTemplate3,
    category: "Executive"
  },
  {
    id: 4,
    name: "Tech Developer",
    description: "Perfect for technical roles",
    image: resumeTemplate4,
    category: "Technical"
  }
];

const Templates = () => {
  return (
    <section id="templates" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group cursor-pointer"
            >
              <div className="border bg-gradient-card rounded-xl p-6 shadow-brand-card hover:shadow-brand-lg transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={template.image}
                    alt={`${template.name} resume template`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Templates;