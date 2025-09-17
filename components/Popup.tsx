import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, TriangleAlert } from "lucide-react";

type PopupProps = {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const Popup: React.FC<PopupProps> = ({
  message,
  type = "info",
  visible,
  setVisible,
}) => {

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
    }, 10000); 

    return () => clearTimeout(timer);
  }, [visible, setVisible]);

  if (!visible) return null;

  const typeStyles: Record<
    "success" | "error" | "warning" | "info",
    { bg: string; text: string; icon: any }
  > = {
    success: {
      bg: "bg-green-100 border-green-400",
      text: "text-green-800",
      icon: <CheckCircle size={18} className="text-green-600" />,
    },
    error: {
      bg: "bg-red-100 border-red-400",
      text: "text-red-800",
      icon: <AlertCircle size={18} className="text-red-600" />,
    },
    warning: {
      bg: "bg-yellow-100 border-yellow-400",
      text: "text-yellow-800",
      icon: <TriangleAlert size={18} className="text-yellow-600" />,
    },
    info: {
      bg: "bg-blue-100 border-blue-400",
      text: "text-blue-800",
      icon: <Info size={18} className="text-blue-600" />,
    },
  };

  const { bg, text, icon } = typeStyles[type];

  return (
    <div className="fixed bottom-4 right-4 z-[999999]">
      <div
        className={`relative ${bg} border shadow-lg rounded-lg px-4 py-3 flex items-center gap-2 w-80`}
      >
        {icon}
        <span className={`text-sm ${text}`}>{message}</span>
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Popup;
