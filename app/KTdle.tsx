'use client';
import { useState } from "react";
import GuessForm, { GiveUpSymbol } from "./components/GuessForm";
import OperativeCard from "./components/OperativeCard";
import OPTable from "./components/OPTable";
import WinTable from './components/WinTable';
import { Operative } from "./killteamjson";
import { operativeNames, operatives } from "./Team";
import { cyrb128, usePersistentState } from "./util";

export default function KTdle({ seed }: { seed: string }) {

  const [correctOperative] = useState<Operative>((() => {
    // Use today's date to pick a determinisically random operative
    const hash = cyrb128(seed)[0]
    // console.debug(`${seed} hash is ${hash}`)
    const name = operativeNames[hash % operativeNames.length]
    // console.debug("Today's operative is", name)
    return operatives.get(name)!
  })())
  const [guesses, setGuesses] = usePersistentState<string[]>(seed, [])
  const [win, setWin] = useState(guesses.includes(correctOperative.opTypeName))
  const openWin = () => setWin(true);
  function submitGuess(guess: string | symbol) {
    const operativeName = (guess === GiveUpSymbol) ? correctOperative.opTypeName : (guess as string)
    if (!operatives.has(operativeName) || guesses.find(g => g === operativeName)) {
      return
    }
    setGuesses(prev => [...prev, operativeName])
    setPreviewOperative("")
    if (operativeName === correctOperative.opTypeName) {
      openWin()
    }
  }

  const [previewOperative, setPreviewOperative] = useState<string>("");

  return <main className="
        flex flex-col
        gap-8
        min-h-screen
        my-16
        bg-white dark:bg-black
      ">
    <OPTable correctOperative={correctOperative} guesses={guesses} />
    <div className="flex justify-center">
      {win ? <WinTable correctOperative={correctOperative} guesses={guesses} /> : <GuessForm submitGuess={submitGuess} preview={setPreviewOperative} operatives={operatives} />}
    </div>
    <OperativeCard operative={operatives.get(previewOperative)!} />
  </main>
}
