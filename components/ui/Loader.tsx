interface LoaderType {
    size?: string,
}
export default function Loader({ size = "1" }: LoaderType) {
    return (
        <div
            style={{
                height: `${size}em`,
                width: `${size}em`,
                borderWidth: `${parseInt(size) / 6}em`,
                borderStyle: "solid",     
                borderColor: "rgb(229 231 235)",
                borderTopColor: "rgb(59 130 246)",
                borderRadius: "9999px",
            }}
            className="animate-spin"
        ></div>

    )
}