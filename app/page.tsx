'use client';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import ShuffleIcon from '@mui/icons-material/ShuffleOutlined';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import Modal from '@mui/material/Modal';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { useTheme } from 'next-themes';
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

  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <header className="w-full flex items-center justify-end py-4 px-8 gap-4 bg-header-bg text-header-text shadow-md transition-colors duration-300">
        <h1 className="text-3xl mr-auto font-bold tracking-wider"><Link href="/">KTdle</Link></h1>
        <button aria-label="Randomize operative" title="Randomize" className='cursor-pointer hover:text-primary transition-colors'
          onClick={random}
        >
          <ShuffleIcon />
        </button>
        <button aria-label="Settings" title="Settings" className='cursor-pointer hover:text-primary transition-colors'
          onClick={openSettings}
        >
          <SettingsRoundedIcon />
        </button>
        <button aria-label="Help" title="Help" className='cursor-pointer hover:text-primary transition-colors'
          onClick={openHelp}
        >
          <HelpOutlineRoundedIcon />
        </button>
      </header>
      {seed !== today && <span className="p-2 bg-primary/20 text-foreground text-center font-bold">Random operative for {seed}</span>}
      <KTdle seed={seed} key={seed} />

      <Modal open={helpOpen} onClose={closeHelp}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            p-6 bg-surface
            flex flex-col gap-4
            max-w-xl w-11/12 max-h-screen
            overflow-scroll
            border border-border rounded-lg shadow-2xl outline-none">
          <h2 className="text-2xl font-bold text-primary">How to Play</h2>
          <p>To start, guess any operative. You have no information to start with - so guess anything!</p>
          <p>When you guess, the table will show the operative's stats and their relationship to the correct operative.</p>
          <p>An up arrow means that the correct operative has a higher value for that statistic, down arrow means it is lower. 3↑ means the correct operative could have a save of 4+.</p>
          <p>A number in parentheses shows how many values in that category are the same between the guess and the correct operative. Seek and Destroy, Recon (1) means the correct operative is on a Kill Team that shares one of those archetypes.</p>
          <p>Use this information to inform your next guess. Keep guessing until you find the correct operative!</p>
          <br />
          <p>Inquisitorial Agents only contains operatives that are unique to that Kill Team. Operatives that could be requisitioned from other teams are only a part of those other teams.</p>
          <br />
          <p>Have fun!</p>
          <p className="text-sm text-foreground/50 mt-8">KTdle version {process.env.APP_VERSION} ({process.env.COMMIT_HASH}). Data sourced from <a className='hover:underline cursor-pointer text-primary' href="https://github.com/vjosset/killteamjson">killteamjson</a></p>
        </div>
      </Modal>

      <Modal open={settingsOpen} onClose={closeSettings}>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 bg-surface flex flex-col gap-6 max-w-md w-11/12 border border-border rounded-lg shadow-2xl outline-none">
          <h2 className="text-2xl font-bold text-primary">Settings</h2>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Theme</h3>
            {mounted && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setTheme('imperium')}
                  className={`px-4 py-3 rounded border text-left flex items-center justify-between transition-colors cursor-pointer ${theme === 'imperium' ? 'border-primary bg-primary/10 font-bold' : 'border-border hover:border-primary/50'}`}
                >
                  <span>Imperium</span>
                  {theme === 'imperium' && <span className="w-3 h-3 rounded-full bg-primary" />}
                </button>
                <button
                  onClick={() => setTheme('xenos')}
                  className={`px-4 py-3 rounded border text-left flex items-center justify-between transition-colors cursor-pointer ${theme === 'xenos' ? 'border-primary bg-primary/10 font-bold' : 'border-border hover:border-primary/50'}`}
                >
                  <span>Xenos</span>
                  {theme === 'xenos' && <span className="w-3 h-3 rounded-full bg-primary" />}
                </button>
                <button
                  onClick={() => setTheme('chaos')}
                  className={`px-4 py-3 rounded border text-left flex items-center justify-between transition-colors cursor-pointer ${theme === 'chaos' ? 'border-primary bg-primary/10 font-bold' : 'border-border hover:border-primary/50'}`}
                >
                  <span>Chaos</span>
                  {theme === 'chaos' && <span className="w-3 h-3 rounded-full bg-primary" />}
                </button>
              </div>
            )}
            <p className="text-sm text-foreground/70 mt-2">
              Note: Light/Dark mode follows your system preference automatically.
            </p>
          </div>

          <button
            onClick={closeSettings}
            className="mt-4 px-4 py-2 bg-primary text-surface rounded font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
