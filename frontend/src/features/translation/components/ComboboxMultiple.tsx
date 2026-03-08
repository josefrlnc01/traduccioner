"use client"
import * as React from "react"
import { ComboboxInput, Combobox, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem } from "../../../shared/components/ui/combobox"


type ComboboxMultipleProps = {
  language : string | null
  setLanguage :  React.Dispatch<React.SetStateAction<string | null>>
}

const languages = ["Español", "Ingles", "Frances", "Italiano"] as const
export function ComboboxMultiple({language, setLanguage}:ComboboxMultipleProps) {

  return (
    <Combobox
    
    items={languages}
    value={language}
    onValueChange={setLanguage} 
    >
      <ComboboxInput
      className={"bg-slate-900 border-none text-gray-200 min-w-2/4 md:p-6 md:pl-0 md:pr-0 md:min-w-2/4 md:w-1/4"} 
      placeholder="Selecciona un lenguaje" />
      <ComboboxContent >
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem  key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}