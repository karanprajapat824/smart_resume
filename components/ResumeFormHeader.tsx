import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ResumeFormHeaderType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  heading: string;
}

export default function ResumeFormHeader({
  isOpen,
  setIsOpen,
  heading,
}: ResumeFormHeaderType) {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="text-xl font-bold flex gap-2 items-center w-full hover:cursor-grab justify-between mt-4"
    >
      <div className="flex gap-2 items-center">
        <div className="border h-3 w-3 rounded-full bg-primary"></div>
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
