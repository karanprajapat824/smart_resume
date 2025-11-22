"use client"
import Templates from "@/components/Templates";
import Header from "@/components/Header";
import { useUtility } from "../providers/UtilityProvider";

export default function Template() {
    const { templateNames } = useUtility();
    return (
        <div>
            <Header items={["my-resumes", "login", "logout"]} />
            <Templates
                templates={templateNames}
            />
        </div>
    )
}