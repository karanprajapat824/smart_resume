import {
  ChevronDown,
  ChevronUp,
  GripHorizontal
} from "lucide-react";

interface ResumeFormHeaderType {
  isOpen: boolean;
  setIsOpen: any;
  heading: string;
  name : string;
}

export default function ResumeFormHeader({
  isOpen,
  setIsOpen,
  heading,
  name
}: ResumeFormHeaderType) {
  return (
    <button
      onClick={() => setIsOpen(name)}
      className="text-xl font-bold flex gap-2 items-center w-full justify-between mt-4"
    >
      <div className="flex gap-2 items-center">
        <div className="hover:cursor-grab"><GripHorizontal /></div>
        {heading}
      </div>
      <div className="px-2">
        {isOpen ? (
          <ChevronUp className="h-5 hover:cursor-pointer" />
        ) : (
          <ChevronDown className="h-5 hover:cursor-pointer" />
        )}
      </div>
    </button>
  );
}
