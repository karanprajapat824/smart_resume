"use client"
import Link from 'next/link';
import Templates from "@/components/Templates";
import Footer from "@/components/Footer";
import LandingPageHeader from "@/components/LandingPageHeader";
import {
  CheckCircle,
  FileText,
  Zap,
  Globe,
  Download,
  Target,
  Star,
} from "lucide-react";
import Button from "@/components/ui/Button";

export const URL = "http://localhost:5000";

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${URL}/verifyToken`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
    });
    let result: any = null;
    try {
      result = await response.json();
    } catch (err) {
      console.error("Failed to parse verifyToken response:", err);
    }

    if (!response.ok) {
      console.log("Token verification failed:", result?.message);
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch (error) {
    console.log("Token verification error:", error);
    localStorage.removeItem("token");
    return false;
  }
}

export default function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <LandingPageHeader />
      
      <section className="py-20 px-4 overflow-hidden">
        <div className="mx-auto text-center max-w-6xl">
          <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border mb-4 hover:cursor-pointer">
            <Zap className="h-4 w-4 mr-1" /> AI-Powered Resume Builder
          </span>
          <h2 className="text-3xl md:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Stand Out with a <span className="text-primary">Smart Resume</span>
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Build your professional resume in minutes with AI-powered templates.
            Choose from professional templates, customize instantly, and land
            your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              variant='primaryPlus'
              size='lg'
              href='/templates'
              icon={<Zap className="h-5 w-5" />}
            >
              Get Started for Free
            </Button>
            <Button
              variant='outline'
              size='lg'
              href='#templates'
              icon={<FileText className="h-5 w-5" />}
            >
              View Sample Resumes
            </Button>
          </div>
        </div>
      </section>

      <section id="templates" className="py-10 overflow-hidden md:py-16 px-4 bg-muted/80">
        <div className="mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-xl md:text-3xl font-bold text-foreground mb-4">
              Pick from Professional Templates
            </h3>
            <p className="text-base text-muted-foreground md:text-lg">
              Choose from our collection of ATS-friendly, professionally
              designed templates
            </p>
          </div>

          <Templates
            templates={[
              "SampleResume",
              "T1",
              "SampleResume",
              "SampleResume",
              "T1",
              "SampleResume"
            ]}
          />

          <div className="text-center mt-10 ">
            <Button
              variant='outline'
              size="lg"
              icon={<FileText className="h-5 w-5" />}
              href="/templates"
            >
              View All Templates
            </Button>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 px-4 overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Smart Resume Builder?
            </h3>
            <p className="text-muted-foreground text-lg">
              Powerful features to help you create the perfect resume
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: "AI-Powered Suggestions",
                description:
                  "Get role-specific content recommendations tailored to your industry and experience level.",
              },
              {
                icon: <CheckCircle className="h-6 w-6" />,
                title: "ATS-Friendly Design",
                description:
                  "Ensures your resume passes applicant tracking systems and reaches human recruiters.",
              },
              {
                icon: <Download className="h-6 w-6" />,
                title: "One-Click Export",
                description:
                  "Download in PDF, DOCX, or share online with a professional link.",
              },
              {
                icon: <FileText className="h-6 w-6" />,
                title: "Real-time Editor",
                description:
                  "See live preview while editing with instant formatting and layout updates.",
              },
              {
                icon: <Globe className="h-6 w-6" />,
                title: "Multilingual Support",
                description:
                  "Create resumes in multiple languages to expand your job search globally.",
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: "Job-tailored Resumes",
                description:
                  "Customize resumes for each job post with AI-powered optimization.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <h4 className="text-lg font-semibold">{feature.title}</h4>
                </div>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section id="testimonials" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Trusted by Job Seekers Worldwide
            </h3>
            <p className="text-muted-foreground text-lg">
              See what our users say about their success stories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer",
                content:
                  "Smart Resume Builder helped me land my dream job at a tech startup. The AI suggestions were spot-on!",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Marketing Manager",
                content:
                  "The templates are professional and the ATS optimization really works. Got 3x more interview calls!",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Data Analyst",
                content:
                  "Love the real-time editor and multilingual support. Created resumes for different markets easily.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="border rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <Footer />
    </div>

  );
}
