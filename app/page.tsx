'use client';
import { operatives, operativeNames } from "./Team"
import { useState } from "react"
import { Operative } from "./killteamjson"
import "./table.css"
import OPTable from "./components/OPTable"
import GuessForm from "./components/GuessForm"
import { cyrb128, usePersistentState } from "./util"

export default function Home() {
  const today = (new Date()).toISOString().slice(0, 10) // YYYY-MM-DD
  const [correctOperative] = useState<Operative>((() => {
    // Use today's date to pick a determinisically random operative
    const hash = cyrb128(today)[0]
    const name = operativeNames[hash % operativeNames.length]
    return operatives.get(name)!
  })())
  const [guesses, setGuesses] = usePersistentState<Operative[]>(today, [])
  function submitGuess(formData: any) {
    const operativeName = formData.get('operative')
    if (!operatives.has(operativeName)) {
      return
    }
    const operative = operatives.get(operativeName)!
    setGuesses(prev => [...prev, operative])
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="
        flex flex-col
        items-center gap-8
        min-h-screen w-full
        py-32 px-16
        bg-white dark:bg-black
      ">
        <GuessForm submitGuess={submitGuess} operativeNames={operativeNames} />
        Correct: {correctOperative.opTypeName}
        <OPTable correctOperative={correctOperative} guesses={guesses} />
      </main>
    </div>
  );
}
