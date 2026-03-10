"use client"
import * as React from "react"
import { ComboboxInput, Combobox, ComboboxContent, ComboboxEmpty, ComboboxList, ComboboxItem } from "../../../shared/components/ui/combobox"


type ComboboxMultipleProps = {
  language : string | null
  setLanguage :  React.Dispatch<React.SetStateAction<string | null>>
}

const languages = ["Español", "Inglés", "Francés", "Italiano"] as const
export function ComboboxMultiple({language, setLanguage}:ComboboxMultipleProps) {

  return (
    <Combobox
    
    items={languages}
    value={language}
    onValueChange={setLanguage} 
    >
      <ComboboxInput
      className={"bg-slate-900 border-none rounded-xl text-gray-200 min-w-2/4  p-6 pl-0 pr-0 lg:min-w-2/4 lg:w-1/4 hover:bg-slate-800 transition-colors"} 
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