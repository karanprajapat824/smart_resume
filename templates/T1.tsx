import React from "react";
import { ResumeData } from "@/app/create-resume/page";

interface TemplateType {
  data: ResumeData;
}

const T1 = React.forwardRef<HTMLDivElement, TemplateType>(
  ({ data }, ref) => {
    const renderMap: Record<string, React.ReactNode> = {
      PersonalDetails: (
        <header
          style={{ backgroundColor: "#475569" }}
          className="bg-[#475569] text-white px-8 py-6 mb-6" key="PersonalDetails">
          <div className="flex items-center gap-4 max-w-6xl mx-auto">
            <div className="w-12 h-12 border-2 border-white flex items-center justify-center text-lg font-bold">
              {data.personalDetails.name ? initialsFromName(data.personalDetails.name) : "DA"}
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wide">
                {data.personalDetails.name || "Your Name"}
              </h1>
              <div className="mt-1 text-sm">
                {/* {data.personalDetails.location || "City, Country"} */}
              </div>
              <div className="text-sm">
                {data.personalDetails.email && (
                  <a href={`mailto:${data.personalDetails.email}`} className="hover:underline">
                    {data.personalDetails.email}
                  </a>
                )}
                {data.personalDetails.email && data.personalDetails.phone && <span className="mx-1">•</span>}
                {data.personalDetails.phone}
              </div>
            </div>
          </div>
        </header>
      ),

      Summary: data.summary ? (
        <section key="Summary" className="max-w-6xl mx-auto px-8 mb-6">
          <ResumeSection title="SUMMARY">
            <p className="text-sm leading-5 text-justify whitespace-pre-line text-gray-700">{data.summary}</p>
          </ResumeSection>
        </section>
      ) : null,

      Skills:
        data.skills && data.skills.length > 0 ? (
          <section key="Skills" className="max-w-6xl mx-auto px-8 mb-6">
            <ResumeSection title="SKILLS">
              <div className="grid grid-cols-4 gap-2">
                {chunkArray(data.skills, 4).map(
                  (col, idx) => (
                    <div key={idx}>
                      <ul className="text-sm space-y-1 text-gray-700">
                        {col.map((s) => (
                          <li key={s.id}>• {s.name}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </ResumeSection>
          </section>
        ) : null,

      WorkExperience:
        data.workExperience && data.workExperience.length > 0 ? (
          <section key="WorkExperience" className="max-w-6xl mx-auto px-8 mb-6">
            <ResumeSection title="EXPERIENCE">
              <div className="space-y-4">
                {data.workExperience.map((we) => (
                  <ItemRow
                    key={we.id}
                    left={
                      <div>
                        <p className="font-medium text-gray-800">{we.role}</p>
                        {/* <p className="text-sm text-gray-600">{we.company} {we.location ? `- ${we.location}` : ""}</p> */}
                        <p className="text-sm text-gray-700 mt-2 whitespace-pre-line  leading-5 text-justify">{we.description}</p>
                        {we.isBulletPoints && we.bulletPoints && (
                          <Bullets items={we.bulletPoints.map((b, i) => <span key={i}>{b}</span>)} />
                        )}
                      </div>
                    }
                    right={<p className="text-sm text-gray-600">{we.duration}</p>}
                  />
                ))}
              </div>
            </ResumeSection>
          </section>
        ) : null,

      Projects:
        data.projects && data.projects.length > 0 ? (
          <section key="Projects" className="max-w-6xl mx-auto px-8 mb-6">
            <ResumeSection title="PROJECTS">
              <div className="space-y-4">
                {data.projects.map((p) => (
                  <div key={p.id}>
                    <ItemRow
                      left={
                        <div>
                          <p className="font-medium">
                            {p.title} {p.link && (<a href={p.link} target="_blank" rel="noreferrer" className="text-sm text-blue-700 hover:underline">(view)</a>)}
                          </p>
                          <div className="text-sm text-gray-700 mt-1 whitespace-pre-line">{p.description}</div>
                          {p.isBulletPoints && p.bulletPoints && (
                            <Bullets items={p.bulletPoints.map((b, i) => <span key={i}>{b}</span>)} />
                          )}
                        </div>
                      }
                    />
                  </div>
                ))}
              </div>
            </ResumeSection>
          </section>
        ) : null,

      Education:
        data.education && data.education.length > 0 ? (
          <section key="Education" className="max-w-6xl mx-auto px-8 mb-6">
            <ResumeSection title="EDUCATION AND TRAINING">
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <ItemRow
                    key={edu.id}
                    left={<div><div className="font-medium">{edu.institution}</div><div className="text-sm text-gray-700">{edu.degree} {edu.location ? `| ${edu.location}` : ""}</div></div>}
                    right={<p className="text-sm text-gray-600">{edu.year}</p>}
                  />
                ))}
              </div>
            </ResumeSection>
          </section>
        ) : null,

      Languages:
        data.languages && data.languages.length > 0 ? (
          <section key="Languages" className="max-w-6xl mx-auto px-8 mb-6">
            <ResumeSection title="LANGUAGES">
              <div className="grid grid-cols-2 gap-4">
                {chunkArray(data.languages, Math.ceil(data.languages.length / 2)).map(
                  (col, idx) => (
                    <div key={idx}>
                      <ul className="text-sm space-y-1 text-gray-700">
                        {col.map((s) => (
                          <li key={s.id}>
                            {s.language} – <span className="italic">{s.level}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            </ResumeSection>
          </section>
        ) : null,


      Achievements:
        data.achievements && data.achievements.length > 0 ? (
          <section key="Achievements" className="max-w-6xl mx-auto px-8 mb-6">
            <ResumeSection title="ACHIEVEMENTS">
              <div className="space-y-3">
                {data.achievements.map((a) => (
                  <ItemRow
                    key={a.id}
                    left={
                      <div>
                        <p className="font-medium">{a.title}</p>
                        <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                          {a.description}
                        </p>
                        {a.isBulletPoints && a.bulletPoints && (
                          <Bullets items={a.bulletPoints.map((a, i) => <span key={i}>{a}</span>)} />
                        )}
                      </div>
                    }
                    right={
                      <p className="text-sm text-gray-600">{a.year}</p>
                    } />

                ))}
              </div>
            </ResumeSection>
          </section>
        ) : null,
    };

    return (
      <main ref={ref} className="print:text-black print:m-0 print:p-0 print">
        <article className="w-full max-w-4xl mx-auto shadow-sm">
          {data.order?.map((section) => renderMap[section])}
        </article>
      </main>
    );
  }
);

T1.displayName = "T1";
export default T1;


/* ---------------- helper components ---------------- */
function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-5 mt-2">
      {items.map((it, i) => (
        <li key={i} className="text-sm leading-6 text-gray-900">{it}</li>
      ))}
    </ul>
  );
}

function ItemRow({ left, right, className }: { left: React.ReactNode; right?: React.ReactNode; className?: string; }) {
  return (
    <div className={("flex items-start justify-between gap-4 " + (className || ""))}>
      <div className="min-w-0">{left}</div>
      {right ? <div className="shrink-0 text-right text-sm text-gray-600">{right}</div> : null}
    </div>
  );
}

function ResumeSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string; }) {
  return (
    <section className={["space-y-2 mt-4", className].filter(Boolean).join(" ")}>
      <h2 className="text-lg font-bold text-blue-600 mb-3 border-b border-gray-300 pb-1 uppercase">{title}</h2>
      <div className="text-sm leading-6 text-gray-900">{children}</div>
    </section>
  );
}

/* ---------------- small utilities ---------------- */
function initialsFromName(name?: string) {
  if (!name) return "DA";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function chunkArray<T>(arr: T[], columns: number): T[][] {
  const out: T[][] = [];
  const per = Math.ceil(arr.length / columns);
  for (let i = 0; i < columns; i++) {
    out.push(arr.slice(i * per, i * per + per));
  }
  return out;
}
