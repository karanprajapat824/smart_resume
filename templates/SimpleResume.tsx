import { ResumeData } from "@/app/create-resume/page";
import React from "react";

interface TemplateType {
  data: ResumeData;
}

const SimpleResume = React.forwardRef<HTMLDivElement, TemplateType>(
  ({ data }, ref) => {
    const renderMap: Record<string, React.ReactNode> = {
      PersonalDetails: (
        <header className="mb-0" key="PersonalDetails">
          <h1 className="text-2xl font-semibold text-neutral-900 capitalize">
            {data.personalDetails.name || "Your Name"}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-neutral-800">
            <span>{data.personalDetails.phone}</span>
            {data.personalDetails.phone &&
              (data.personalDetails.email ||
                data.personalDetails.github ||
                data.personalDetails.linkedin ||
                data.personalDetails.location ||
                data.personalDetails.country
              ) && (
                <span className="text-neutral-400">|</span>
              )}

            <a
              href={`mailto:${data.personalDetails.email}`}
              className="text-blue-700 hover:underline"
            >
              {data.personalDetails.email}
            </a>
            {data.personalDetails.email &&
              (data.personalDetails.github ||
                data.personalDetails.linkedin
              ) && (
                <span className="text-neutral-400">|</span>
              )}

            {data.personalDetails.github && (
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://github.com/${cleanUsername(
                  data.personalDetails.github
                )}`}
                className="text-blue-700 hover:underline"
              >
                GitHub
              </a>
            )}

            {data.personalDetails.github &&
              (
                data.personalDetails.linkedin
              ) && (
                <span className="text-neutral-400">|</span>
              )}

            {data.personalDetails.linkedin && (
              <a
                target="_blank"
                rel="noreferrer"
                href={`https://linkedin.com/in/${cleanUsername(
                  data.personalDetails.linkedin
                )}`}
                className="text-blue-700 hover:underline"
              >
                LinkedIn
              </a>
            )}

            {
              data.personalDetails.location && <span className="text-neutral-400">|</span>
            }
            {
              data.personalDetails.location && <div>
                {data.personalDetails.location} {data.personalDetails.country}
              </div>
            }
          </div>
        </header>
      ),

      Summary: data.summary ? (
        <ResumeSection title="Professional Summary" key="Summary">
          <p className="text-[13px] leading-5 text-justify whitespace-pre-line">{data.summary}</p>
        </ResumeSection>
      ) : null,

      Education:
        data.education.length > 0 ? (
          <ResumeSection title="Education" key="Education">
            <div className="space-y-1">
              {data.education.map((edu) => (
                <ItemRow
                  key={edu.id}
                  left={
                    <div>
                      <div className="font-medium">{edu.institution}</div>
                      <div className="text-[13px] text-neutral-700 flex items-center gap-1">
                        <div className="capitalize">{edu.degree}</div>
                        <div>{edu.grade && "|"}</div>
                        <div>{edu.grade || null}</div>
                        <div>{edu.location && "|"}</div>
                        <div className="capitalize">{edu.location}</div>
                      </div>
                      <div className="text-[13px] text-neutral-700 text-justify leading-5 whitespace-pre-line">
                        {edu.description}
                      </div>
                    </div>
                  }
                  right={<p>Graduation Date: {edu.year}</p>}
                />
              ))}
            </div>
          </ResumeSection>
        ) : null,

      WorkExperience:
        data.workExperience.length > 0 ? (
          <ResumeSection title="Work Experience" key="WorkExperience">
            <div className="space-y-4">
              {data.workExperience.map((we) => (
                <ItemRow
                  key={we.id}
                  left={
                    <div>
                      <p className="font-medium">
                        {we.company} — {we.role}
                      </p>
                      <p className="text-[13px] text-neutral-700 mt-1 leading-5 text-justify whitespace-pre-line w-145">
                        {we.description}
                      </p>
                      {we.isBulletPoints && (
                        <Bullets
                          items={we.bulletPoints.map((b, i) => (
                            <span key={i}>{b}</span>
                          ))}
                        />
                      )}
                    </div>
                  }
                  right={<p>{we.duration}</p>}
                />
              ))}
            </div>
          </ResumeSection>
        ) : null,

      Skills:
        data.skills.length > 0 ? (
          <ResumeSection title="Technical Skills" key="Skills">
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => (
                <span
                  style={{ backgroundColor: "#f5f5f5" }}
                  key={s.id}
                  className="text-[13px] px-2 py-1 rounded-md "
                >
                  {s.name}
                </span>
              ))}
            </div>
          </ResumeSection>
        ) : null,

      Projects:
        data.projects.length > 0 ? (
          <ResumeSection title="Projects" key="Projects">
            <div className="space-y-4">
              {data.projects.map((p) => (
                <div key={p.id}>
                  <ItemRow
                    left={
                      <div>
                        <p className="font-medium">
                          {p.title}{" "}
                          {p.link && (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[13px] font-normal text-neutral-700 hover:underline"
                            >
                              (view)
                            </a>
                          )}
                        </p>
                        <div className="text-[13px] text-neutral-700 mt-1 leading-5 whitespace-pre-line text-justify">
                          {p.description}
                        </div>
                        {p.isBulletPoints && (
                          <Bullets
                            items={p.bulletPoints.map((b, i) => (
                              <span key={i}>{b}</span>
                            ))}
                          />
                        )}
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          </ResumeSection>
        ) : null,

      Achievements:
        data.achievements.length > 0 ? (
          <ResumeSection title="Achievements" key="Achievements">
            <div className="space-y-3">
              {data.achievements.map((a) => (
                <ItemRow
                  key={a.id}
                  left={
                    <div>
                      <p className="font-medium">{a.title}</p>
                      <p className="text-[13px] text-neutral-700 mt-1 text-justify leading-5 whitespace-pre-line">
                        {a.description}
                      </p>
                      {a.isBulletPoints && (
                        <Bullets
                          items={a.bulletPoints.map((b, i) => (
                            <span key={i}>{b}</span>
                          ))}
                        />
                      )}
                    </div>
                  }
                  right={<p>{a.year}</p>}
                />
              ))}
            </div>
          </ResumeSection>
        ) : null,

      Languages:
        data.languages && data.languages.length > 0 ? (
          <section key="Languages">
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
    };

    return (
      <main ref={ref} className="bg-neutral-50 px-0 py-0 print:m-0 print:w-full">
        <article className="bg-white p-4 md:p-8 shadow-sm">
          {data.order.map((section) => renderMap[section])}
        </article>
      </main>
    );
  }
);

SimpleResume.displayName = "SimpleResume";
export default SimpleResume;

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc pl-5  mt-2 w-145">
      {items.map((it, i) => (
        <li key={i} className="text-[13px] leading-6 text-neutral-900 text-justify">
          {it}
        </li>
      ))}
    </ul>
  );
}

function ItemRow({
  left,
  right,
  className,
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={"flex items-start justify-between gap-4 " + (className || "")}
    >
      <div className="min-w-0">{left}</div>
      {right ? (
        <div className="shrink-0 text-right text-[13px] leading-5 text-neutral-700">
          {right}
        </div>
      ) : null}
    </div>
  );
}

function ResumeSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={["space-y-2 mt-2", className].filter(Boolean).join(" ")}
    >
      <h2 className="text-lg font-semibold tracking-wide uppercase text-neutral-800">
        {title}
      </h2>
      <div style={{ backgroundColor: "#d4d4d4" }} className="h-px" />
      <div className="text-sm leading-6 text-neutral-900">{children}</div>
    </section>
  );
}

function cleanUsername(s: string) {
  if (!s) return "";
  return s
    .replace(/https?:\/\//, "")
    .replace(/www\./, "")
    .replace(/linkedin.com\/in\//, "")
    .replace(/github.com\//, "")
    .replace(/\/.+$/, "")
    .trim();
}

function chunkArray<T>(arr: T[], n: number) {
  const out: T[][] = [];
  const per = Math.ceil(arr.length / n);
  for (let i = 0; i < n; i++) {
    out.push(arr.slice(i * per, i * per + per));
  }
  return out;
}
