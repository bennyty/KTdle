import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRef, useState } from "react";
import { Operative } from "../killteamjson";
import { matchSorter } from "match-sorter";

interface GuessFormProps {
  submitGuess: (formData: any) => void;
  preview: (e: string) => void;
  operatives: Operative[];
}
const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});


export default function GuessForm({ submitGuess, preview, operatives }: GuessFormProps) {
  const [value, setValue] = useState<Operative | null>(null);
  function clearAndSubmit() {
    console.log("clear and submit", value);
    const formData = new FormData()
    formData.append('operative', value?.opTypeName || "")
    submitGuess(formData)
    setValue(null)
  }

  const filterOptions = (options: Operative[], { inputValue }: { inputValue: string }) =>
    matchSorter(options, inputValue, { keys: ['opTypeName', 'keywords'] })

  return (
    <form action={clearAndSubmit} className="flex w-6/12 min-w-sm gap-2">
      <ThemeProvider theme={theme}>
        <Autocomplete
          options={operatives}
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
        />
      </ThemeProvider>

      <button
        className="px-6
          rounded font-medium text-white
          whitespace-nowrap
          bg-red-500 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        Submit Guess
      </button>
    </form>
  )
}