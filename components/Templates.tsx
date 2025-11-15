import Button from "./ui/Button";
import SmallPreview from "./Preview";
import { ResumeData } from "@/exports/utility";
import { ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import Zoom from "./Zoom";

interface TemplateType {
  templates: string[];
}

const Templates = ({ templates }: TemplateType) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isZoom, setIsZoom] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  let defaultResumeData : ResumeData = {
    id: "",
    template: "",
    order: [
      "PersonalDetails",
      "Summary",
      "WorkExperience",
      "Education",
      "Skills",
      "Projects",
      "Achievements",
      "Languages",
    ],
    personalDetails: {
      name: "Karan Prajapat",
      email: "Karanprajapat824@gmail.com",
      phone: "+918770738268",
      linkedin: "karanprajapat824",
      github: "karanprajapat824",
      location: "Ujjain M.P,",
      country: "India",
    },
    summary:
      "Full Stack Web Developer skilled in MERN stack and Next.js, with expertise in Java, JavaScript, and TypeScript. Strong\nfoundation in DSA and passionate about building practical products for developers. Created projects like ElementX\nand Smart Resume, emphasizing usability.",
    workExperience: [
      {
        id: "1",
        company: "IndusAI Solutions",
        role: "Web Development Intern",
        duration: "Jun 2024 - Oct 2024",
        description: "",
        bulletPoints: [
          "Developed and tested web pages using HTML, CSS, and JavaScript.",
          "Implemented responsive layouts and fixed bugs with the team.",
          "Followed best coding practices and used Git for version control.",
        ],
      },
    ],
    education: [
      {
        id: "1",
        degree: "Bachelor Of Technology",
        institution: "Mahakal Intitute of Technology and Management",
        location: "Ujjain, M.P.",
        year: "2025",
        grade: "7.65 CGPA",
        description: "",
      },
      {
        id: "2",
        degree: "12th MP Board",
        institution: "Jai Bharti Higher Secondry School",
        location: "Ujjain, M.P.",
        year: "2021",
        grade: "80%",
        description: "",
      },
      {
        id: "3",
        degree: "10th MP Board",
        institution: "Jai Bharti Higher Secondry School",
        location: "Ujjain, M.P.",
        year: "2019",
        grade: "80%",
        description: "",
      },
    ],
    skills: [
      { id: "1", name: "C++", level: "", key: "", value: "" },
      { id: "2", name: "Java", level: "", key: "", value: "" },
      { id: "3", name: "JavaScript", level: "", key: "", value: "" },
      { id: "4", name: "TypeScript", level: "", key: "", value: "" },
      { id: "5", name: "MongoDB", level: "", key: "", value: "" },
      { id: "6", name: "MySql", level: "", key: "", value: "" },
      { id: "7", name: "PostreSql", level: "", key: "", value: "" },
      { id: "8", name: "HTML5", level: "", key: "", value: "" },
      { id: "9", name: "CSS", level: "", key: "", value: "" },
      { id: "10", name: "ReactJs", level: "", key: "", value: "" },
      { id: "11", name: "NextJs", level: "", key: "", value: "" },
      { id: "12", name: "Tailwind Css", level: "", key: "", value: "" },
      { id: "13", name: "Git / Github", level: "", key: "", value: "" },
    ],
    projects: [
      {
        id: "1",
        title: "Elementx",
        link: "",
        description: "",
        bulletPoints: [
          "8000+ reusable UI components — buttons, cards, forms, switches, etc.",
          "Real-time in-browser editor with live preview on every keystroke.",
          "Code conversion utilities to convert HTML/CSS to React, Vue, Angular.",
          "Authentication: Google OAuth, GitHub OAuth, and JWT support.",
        ],
      },
      {
        id: "2",
        title: "Smart Resume",
        link: "",
        description: "",
        bulletPoints: [
          "Built a dynamic resume builder allowing users to create, edit, and export resumes.",
          "Integrated real-time preview and customization features for personalized resume layouts.",
          "Implemented user authentication and secure data storage for seamless access to resumes.",
        ],
      },
    ],
    achievements: [],
    languages: [
      { id: "1", language: "Hindi", level: "Intermediate" },
      { id: "2", language: "English", level: "Intermediate" },
    ],
  };

  let resumeData: ResumeData = {
    id: "",
    template: "",
    order: [
      "PersonalDetails",
      "Summary",
      "WorkExperience",
      "Education",
      "Skills",
      "Projects",
      "Achievements",
      "Languages",
    ],
    personalDetails: {
      name: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      location: "",
      country: "",
    },
    summary:
      "",
    workExperience: [
    ],
    education: [
    ],
    skills: [
    ],
    projects: [
    ],
    achievements: [],
    languages: [
    ],
  };



  const handleSelectedTemplate = (template: string) => {
    let data = localStorage.getItem("data");
    if (data) {
      resumeData = JSON.parse(data);
    }
    const dataToStore = { ...resumeData, template }
    localStorage.setItem("data", JSON.stringify(dataToStore));
    localStorage.setItem("template", template);
    window.location.href = "/create-resume";
  }

  const handleZoomTemplate = (template: string) => {
    let data = localStorage.getItem("data");
    if (data) {
      resumeData = JSON.parse(data);
    }
    const dataToStore = { ...resumeData, template }
    localStorage.setItem("data", JSON.stringify(dataToStore));
    localStorage.setItem("template", template);
    setIsZoom(true);
  }

  return (
    <section id="templates" className="pt-0 md:pt-10 bg-muted/80">
      <div className="mx-auto px-4">
        <div className="text-center py-12">
          <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4">
            Pick from Professional Templates
          </h3>
          <p className="text-base text-muted-foreground md:text-lg">
            Choose from our collection of ATS-friendly, professionally
            designed templates
          </p>
        </div>
        <div className="grid place-items-center md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 pb-10">
          {templates.map((template, index) => {
            return (
              <div
                key={index}
                className={`overflow-hidden rounded-lg small-page-wrapper relative group
                  motion-safe:transform-gpu will-change-transform
                  transition-[transform,box-shadow] duration-1000 ease-out
                  ${!isMobile ? "hover:-translate-y-1 hover:shadow-xl" : ""}
                  shadow-lg cursor-pointer`}
              >
                <div
                  className={`absolute inset-0 z-20 flex flex-col items-center justify-between p-4
                    transition-[opacity,transform] duration-500 ease-out hover:bg-black/30 drop-shadow-lg
                    ${isMobile
                      ? "opacity-100 pointer-events-auto"
                      : "opacity-0 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto -translate-y-2"
                    }`}
                >
                  <div></div>

                  <div className="border p-4 rounded-full bg-muted/80 hover:scale-105 z-30 transition-transform cursor-pointer">
                    <ZoomIn
                      onClick={() => handleZoomTemplate(template)}
                    />
                  </div>

                  <Button
                    onClick={() => handleSelectedTemplate(template)}
                    variant="primary" size="md" className="w-[100%]">
                    Use This Template
                  </Button>
                </div>

                <div className="relative z-10">
                  <SmallPreview data={defaultResumeData} template={template} />
                </div>
              </div>
            );
          })}
          <Zoom isOpen={isZoom} setIsOpen={setIsZoom} data={defaultResumeData} handleSelectedTemplate={handleSelectedTemplate} />
        </div>
      </div>
    </section>
  );
};

export default Templates;
