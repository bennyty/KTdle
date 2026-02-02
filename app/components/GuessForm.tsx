import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRef, useState } from "react";

interface GuessFormProps {
  submitGuess: (formData: any) => void;
  preview: (e: string) => void;
  operativeNames: string[];
}
const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});


export default function GuessForm({ submitGuess, preview, operativeNames }: GuessFormProps) {
  const [value, setValue] = useState("")
  function clearAndSubmit() {
    console.log("clear and submit", value);
    const formData = new FormData()
    formData.append('operative', value)
    submitGuess(formData)
    setValue("")
  }

  return (
    <form action={clearAndSubmit} className="flex w-6/12 min-w-sm gap-2">
      <ThemeProvider theme={theme}>
        <Autocomplete
          options={operativeNames}
          value={value}
          autoSelect
          autoComplete
          autoHighlight
          renderInput={(params) => (
            <TextField {...params}
              name="operative"
              type="search"
              placeholder="Guess an Operative"
            />
          )}
          fullWidth
          onChange={(e, value) => {
            preview(value ?? "")
            setValue(value ?? "")
          }}
        />
      </ThemeProvider>

      <button
        className="px-6
          rounded font-medium text-white
          whitespace-nowrap
          bg-teal-500 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        Submit Guess
      </button>
    </form>
  )
}