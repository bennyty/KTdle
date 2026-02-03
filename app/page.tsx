'use client';
import { operatives, data, operativeNames } from "./Team"
import { useState } from "react"
import { Operative } from "./killteamjson"
import OPTable from "./components/OPTable"
import GuessForm from "./components/GuessForm"
import { cyrb128, usePersistentState } from "./util"
import OperativeCard from "./components/OperativeCard";

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
    if (!operatives.has(operativeName) || guesses.find(g => g.opTypeName === operativeName)) {
      return
    }
    const operative = operatives.get(operativeName)!
    setGuesses(prev => [...prev, operative])
    setPreviewOperative("")
  }

  const [previewOperative, setPreviewOperative] = useState<string>("");

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="w-full py-4 px-8 bg-gray-900 text-white shadow-md">
      <h1 className="text-3xl">KTdle</h1>
      </header>
      <main className="
        flex flex-col
        gap-8
        min-h-screen
        my-16
        bg-white dark:bg-black
      ">
        <OPTable correctOperative={correctOperative} guesses={guesses} />
        <div className="mx-auto">
          <GuessForm submitGuess={submitGuess} preview={setPreviewOperative} operatives={operatives} />
        </div>
        <OperativeCard operative={operatives.get(previewOperative)!} />
      </main>
    </div>
  );
}
