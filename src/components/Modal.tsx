import { FC, ReactNode } from "react"

interface ModalProp {
    children: ReactNode,
    className?: string
}

export const Modal: FC<ModalProp> = ({ children, className }) => {

    return (
        <>
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                <div className={`bg-black px-8 py-5 rounded-lg shadow-lg w-fit ${className}`}>
                    {children}
                </div>
            </div>

        </>
    )
}
