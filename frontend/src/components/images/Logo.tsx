import Image from "next/image";


type LogoImageProps = {
    className?: string
    width?: number
    height?: number
}
export function LogoImage({
    className, height = 40, width = 40
}: LogoImageProps) {
    return (
        <Image
            src={"/images/logo.png"}
            alt="Logo"
            width={width}
            height={height}
            className={className}
            priority
        />
    )
}