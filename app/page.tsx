'use client';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { useState } from "react";
import GuessForm from "./components/GuessForm";
import OperativeCard from "./components/OperativeCard";
import OPTable from "./components/OPTable";
import { Operative } from "./killteamjson";
import { operativeNames, operatives } from "./Team";
import { cyrb128, usePersistentState } from "./util";
import Modal from '@mui/material/Modal';

export default function Home() {
  const today = (new Date()).toISOString().slice(0, 10) // YYYY-MM-DD

  const [helpOpen, setHelpOpen] = useState(false);
  const openHelp = () => setHelpOpen(true);
  const closeHelp = () => setHelpOpen(false);

  const [winOpen, setWinOpen] = useState(false);
  const openWin = () => setWinOpen(true);
  const closeWin = () => setWinOpen(false);

  const [correctOperative] = useState<Operative>((() => {
    // Use today's date to pick a determinisically random operative
    const hash = cyrb128(today)[0]
    console.debug(`${today} hash is ${hash}`)
    const name = operativeNames[hash % operativeNames.length]
    console.debug("Today's operative is", name)
    return operatives.get(name)!
  })())
  const [guesses, setGuesses] = usePersistentState<string[]>(today, [])
  function submitGuess(formData: any) {
    const operativeName = formData.get('operative') as string
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

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="w-full flex items-center justify-between py-4 px-8 bg-gray-900 text-white shadow-md">
        <h1 className="text-3xl">KTdle</h1>
        <button aria-label="Help" title="Help" className='cursor-pointer'
          onClick={openHelp}
        >
          <HelpOutlineRoundedIcon />
        </button>
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
        <Modal open={helpOpen} onClose={closeHelp}>
          <div className="absolute left-1/2 top-1/2 -translate-1/2 p-4 bg-white dark:bg-black flex flex-col gap-4 max-w-xl w-11/12 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-black dark:text-white">How to Play</h2>
            <p>To start, guess any operative. You have no information so guess anything.</p>
            <p>When you guess, the table with show the operative's stats and their relationship to the correct operative.</p>
            <p>An up arrow means that the correct operative has a higher value for that statistic, down arrow means it is lower. 3↑ means the correct operative could have a save of 4+.</p>
            <p>A number in parentheses shows how many values in that category are the same between the guess and the correct operative. Seek and Destory, Recon (1) means the correct operative is on a Kill Team that shares one of those archetypes.</p>
            <p>Use this information to inform your next guess. Keep guessing until you find the correct operative!</p>
            <br />
            <p>Inquisitorial Agents only contains operatives that are unique to that Kill Team. Operatives that could be requisitioned from other teams are only a part of those other teams.</p>
            <br />
            <p>Have fun!</p>
            <br />
            <br />
            <p className="text-sm text-gray-500">KTdle version {process.env.APP_VERSION} (commit {process.env.COMMIT_HASH}). Data sourced from <a href="https://github.com/vjosset/killteamjson">killteamjson</a></p>
          </div>
        </Modal>
        <Modal open={winOpen} onClose={closeWin}>
          <div className="absolute left-1/2 top-1/2 -translate-1/2 p-4 bg-white dark:bg-black flex flex-col gap-4 max-w-xl w-11/12 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center text-black dark:text-white">You Win!</h2>
            <p className="text-center">The correct operative was <strong>{correctOperative.opTypeName}</strong>.</p>
            <p className="text-center">Come back tomorrow for a new operative to guess!</p>
          </div>
        </Modal>


    </div>
  );
}
