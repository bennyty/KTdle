import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { matchSorter } from "match-sorter";
import { useState } from "react";
import { Operative } from "../killteamjson";

interface GuessFormProps {
  submitGuess: (formData: any) => void;
  preview: (e: string) => void;
  operatives: Map<String, Operative>;
}
const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export const GiveUpSymbol = Symbol("I give up")

export default function GuessForm({ submitGuess, preview, operatives }: GuessFormProps) {
  const [value, setValue] = useState<Operative | null>(null);
  function clearAndSubmit() {
    submitGuess(value?.opTypeName)
    setValue(null)
  }

  const filterOptions = (options: Operative[], { inputValue }: { inputValue: string }) =>
    matchSorter(options, inputValue, { keys: ['opTypeName', 'keywords'] })

  return (
    <form action={clearAndSubmit} className="flex w-6/12 min-w-sm gap-2">
      <ThemeProvider theme={theme}>
        <Autocomplete
          options={Array.from(operatives.values())}
          getOptionLabel={o => o.opTypeName}
          value={value}
          autoSelect
          autoComplete
          fullWidth
          renderInput={(params) => (
            <TextField {...params}
              name="operative"
              type="search"
              placeholder="Guess an Operative"
            />
          )}
          filterOptions={filterOptions}
          onChange={(e, value) => {
            preview(value?.opTypeName || "")
            setValue(value)
          }}
          onHighlightChange={(e, value) => {
            preview(value?.opTypeName || "")
          }}
        />
      </ThemeProvider>

      <button
        className="lg:px-6 px-1
          rounded font-medium text-white
          whitespace-nowrap
          bg-green-500 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          type="submit"
      >
        Submit Guess
      </button>
      <button
        className="lg:px-6 px-1
          rounded font-medium text-white
          whitespace-nowrap
          bg-red-500 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          onClick={(e) => {
            e.preventDefault()
            if (confirm("Really give up?")) {
              submitGuess(GiveUpSymbol)
            }
          }}
      >
        Give Up
      </button>
    </form>
  )
}