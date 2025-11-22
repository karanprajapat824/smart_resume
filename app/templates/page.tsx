"use client"
import Templates from "@/components/Templates";
import Header from "@/components/Header";
import { useUtility } from "../providers/UtilityProvider";
import { Button } from "@/components/Ui";

export default function Template() {
    const { templateNames, clearForm } = useUtility();
    return (
        <div>
            <Header
                items={["my-resumes", "login", "logout"]}
                afterLoginRedirect="/template"
            />
            <Templates
                templates={templateNames}
            />
            <div className="p-10 w-full text-center">
                <Button
                    size="lg"
                    variant="primaryPlus"
                    href="/create-resume"
                    className="text-xl px-10"
                    onClick={clearForm}
                >Skip for now</Button>
            </div>
        </div>
    )
}