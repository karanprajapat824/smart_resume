import { ResumeData } from "@/app/create-resume/page";
import SmallPreview from "@/components/Preview";
import { Edit, Trash2, ZoomIn, } from "lucide-react"
import { URL } from "@/exports/info";
import Zoom from "./Zoom";
import { useState } from "react";
import Modal from "./Modal";
import Popup from "./Popup";

interface myresumeCardType {
    resume: ResumeData,
    fetchResumes: () => void;
}

export default function MyresumeCard({ resume, fetchResumes }: myresumeCardType) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [DeletePopup, setDeletePopup] = useState(false);
    const [DeleteMessage, setDeleteMessage] = useState("Deleted successfully");

    async function handleDelete(id: string) {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch(URL + "/deleteResume", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`
            },
            body: JSON.stringify({ id })
        });

        if (response.ok) {
            setDeleteMessage("Resume deleted successfully!");
            setDeletePopup(true);
            setIsDelete(false);
            fetchResumes();
        }
        else {
            setDeleteMessage("Something went wrong!");
            setDeletePopup(true);
            setIsDelete(false);
        }
    }

    return (
        <div className="max-w-[285px] relative h-100 rounded flex flex-col items-center justify-start" key={resume.id}>
            <Modal
                isOpen={isDelete}
                primaryButtonText="Delete"
                secondaryButtonText="Cancel"
                onPrimaryClick={() => handleDelete(resume.id)}
                onSecondaryClick={() => setIsDelete(false)}
                message="Confirm Delete!"
                description="Are you sure you want to delete this? This action cannot be undone."
            />
            <Popup
                message={DeleteMessage}
                type={DeleteMessage === "Resume deleted successfully!" ? "success" : "error"}
                visible={DeletePopup}
                setVisible={setDeletePopup}
            />
            <div
                className="absolute border-2 hover:border-blue-500 hover:shadow-lg overflow-hidden transition-all duration-200 flex flex-col items-center justify-between w-full h-full opacity-0 hover:opacity-100 transition-opacity z-20"
            >
                <div className="group relative flex w-full items-end justify-end px-4 py-2">
                </div>
                <div
                    onClick={() => setIsOpen(true)}
                    className="p-4 rounded-full bg-yellow-300 hover:bg-yellow-500 cursor-pointer">
                    <ZoomIn
                        className="group relative"
                    />
                </div>
                <div className="px-3 py-3 w-full flex justify-around items-center group relative">
                    <button
                        onClick={() => setIsDelete(true)}
                        className="px-3 py-1 bg-red-600 cursor-pointer text-destructive-foreground rounded-lg flex items-center gap-2 hover:bg-destructive">
                        <Trash2 className="h-4 cursor-pointer" />
                        Delete
                    </button>
                    <button
                        className="px-3 py-1 bg-green-600 cursor-pointer text-accent-foreground  rounded-lg flex items-center gap-2 hover:bg-accent"
                    >
                        <Edit className="h-4 " />
                        Update
                    </button>
                </div>
            </div>

            <div className="cursor-pointer w-[285px] border-2 border-gray-300 h-100 overflow-hidden relative">
                <SmallPreview
                    data={resume}
                    template={resume.template}
                />
            </div>
            <Zoom setIsOpen={setIsOpen} isOpen={isOpen} data={resume} />
        </div>
    )
}