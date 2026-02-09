'use client';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ShuffleIcon from '@mui/icons-material/ShuffleOutlined';
import Modal from '@mui/material/Modal';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from "react";
import KTdle from './KTdle';
import Link from 'next/link';

export default function Home() {
  const router = useRouter()
  const today = (new Date()).toISOString().slice(0, 10) // YYYY-MM-DD
  const params = useSearchParams()
  const pathname = usePathname()
  let seed = params.get('day') ?? today

  const [helpOpen, setHelpOpen] = useState(false);
  const openHelp = () => setHelpOpen(true);
  const closeHelp = () => setHelpOpen(false);

  function getRandomDate(from: Date, to: Date) {
    const fromTime = from.getTime();
    const toTime = to.getTime();
    return new Date(fromTime + Math.random() * (toTime - fromTime));
}

  function random() {
    const randomSeed = getRandomDate(new Date(2024, 0, 1), new Date()).toISOString().slice(0, 10)
    router.push(`${pathname}?day=${randomSeed}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <header className="w-full flex items-center justify-end py-4 px-8 gap-4 bg-gray-900 text-white shadow-md">
        <h1 className="text-3xl mr-auto"><Link href="/">KTdle</Link></h1>
        <button aria-label="Randomize operative" title="Randomize" className='cursor-pointer'
          onClick={random}
        >
          <ShuffleIcon />
        </button>
        <button aria-label="Help" title="Help" className='cursor-pointer'
          onClick={openHelp}
        >
          <HelpOutlineRoundedIcon />
        </button>
      </header>
      {seed !== today && <span className="p-2 bg-yellow-100 dark:bg-yellow-900 text-black dark:text-white text-center">Random operative for {seed}</span>}
      <KTdle seed={seed} />
      <Modal open={helpOpen} onClose={closeHelp}>
        <div className="absolute left-1/2 top-1/2 -translate-1/2 p-4 bg-white dark:bg-black flex flex-col gap-4 max-w-xl w-11/12 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-black dark:text-white">How to Play</h2>
          <p>To start, guess any operative. You have no information to start with - so guess anything!</p>
          <p>When you guess, the table with show the operative's stats and their relationship to the correct operative.</p>
          <p>An up arrow means that the correct operative has a higher value for that statistic, down arrow means it is lower. 3↑ means the correct operative could have a save of 4+.</p>
          <p>A number in parentheses shows how many values in that category are the same between the guess and the correct operative. Seek and Destory, Recon (1) means the correct operative is on a Kill Team that shares one of those archetypes.</p>
          <p>Use this information to inform your next guess. Keep guessing until you find the correct operative!</p>
          <br />
          <p>Inquisitorial Agents only contains operatives that are unique to that Kill Team. Operatives that could be requisitioned from other teams are only a part of those other teams.</p>
          <br />
          <p>Have fun!</p>
          <p className="text-sm text-gray-500 mt-8">KTdle version {process.env.APP_VERSION} (commit {process.env.COMMIT_HASH}). Data sourced from <a href="https://github.com/vjosset/killteamjson">killteamjson</a></p>
        </div>
      </Modal>
    </div>
  );
}
