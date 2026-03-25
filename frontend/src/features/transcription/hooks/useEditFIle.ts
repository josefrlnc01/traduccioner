import { useState } from "react"

export const useEditFile = () => {
    const [isOpen, setIsOpen] = useState(false)

    return {isOpen, setIsOpen}
}