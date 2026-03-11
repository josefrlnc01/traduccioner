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
      className={"bg-slate-800  hover:bg-slate-800/80 border-none rounded-xl text-gray-200 w-full  p-6 pl-0 pr-0 transition-colors"} 
      placeholder="Seleccionar idioma" />
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