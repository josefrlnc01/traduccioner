import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
} from "@/components/ui/combobox"
import { useState } from "react";
import { sendLink } from "../services/sendLink";
import * as React from "react"



export function SelectLanguage() {
    const [value, setValue] = React.useState<string[]>([])
    const [inputValue, setInputValue] = useState('')
        const [message, setMessage] = useState('')
    const languages = ["Español, Ingles, Frances, Italiano"]

     const handleInput = (e:React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
            setInputValue(e.target.value)
        }
    
        const handleSubmit = async (e:React.ChangeEvent<HTMLFormElement, HTMLFormElement>) => {
            e.preventDefault()
            const result = await sendLink(inputValue)
            if (result) {
                const { message} = result
                setMessage(message)
            }
        }

    function getAbbreviateLanguage(lang: string) {
        switch (lang) {
            case "Español":
                return "es"
            case "Ingles":
                return "en"
            case "Frances":
                return "fr"
            case "Italiano":
                return "it"
            default:
                return ""
        }
    }
    return (
        <Combobox
            items={languages}
            multiple
            value={value}
            onValueChange={setValue}
            
        >
            <ComboboxChips>
                <ComboboxValue>
                    {value.map((item) => (
                        <ComboboxChip key={item}>{item}</ComboboxChip>
                    ))}
                </ComboboxValue>
                <ComboboxChipsInput onChange={handleInput} placeholder="Add framework" />
            </ComboboxChips>
            <ComboboxContent>
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item} value={getAbbreviateLanguage(item)}>
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}