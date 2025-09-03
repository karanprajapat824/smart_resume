import { ResumeData } from "@/app/create-resume/page";
import Template1 from "@/templates/Template1";

interface LivePreviewType{
  data : ResumeData;
  template : string;
  onChange: (data: Partial<ResumeData>) => void;
}

export interface TemplateType {
  data : ResumeData
}

export default function LivePreview({data , template = "Template1" , onChange} : LivePreviewType) {
  return (
    <div className="space-y-4 h-fit sticky flex top-0 w-160 overflow-auto">
      <div className="bg-card  border p-0 a4-page">
        <Template1 data={data} onChange={onChange}/>
      </div>
    </div>
  );
}
