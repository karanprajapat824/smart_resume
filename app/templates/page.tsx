"use client"

export default function Templates() {

    const handleClick = (template: string) => {
        localStorage.setItem("template",template);
        window.location.href = "/create-resume"
    }

    return (
        <>
            <div onClick={() => handleClick("SimpleResume")}>Simple Resume</div>
            <div onClick={() => handleClick("T1")}>T1</div>
        </>

    )
}