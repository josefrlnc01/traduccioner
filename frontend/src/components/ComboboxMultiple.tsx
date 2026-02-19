"use client"
import * as React from "react"
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"


const languages = ["Español", "Ingles", "Frances", "Italiano"] as const
export function ComboboxMultiple() {
  const anchor = useComboboxAnchor()

  
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
    <Combobox items={languages}>
      <ComboboxInput className={"bg-slate-900 border-none text-gray-200"} placeholder="Selecciona un lenguaje" />
      <ComboboxContent >
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}