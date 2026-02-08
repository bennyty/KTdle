import { Operative } from "../killteamjson";
import { killteams, operatives } from "../Team";
import { compareArrays } from "../util";


export default function OPTable({ correctOperative, guesses }: { correctOperative: Operative, guesses: string[] }) {
  const ops = guesses.map(name => operatives.get(name)!).filter(op => !!op)

  function getKTName(op: Operative) {
    const teams = killteams.get(op.killteamId)!.map(kt => kt.killteamName)
    if (teams.length !== 1) alert(`Operative ${op.opTypeName} has multiple teams: ${teams.join(', ')}`)
    return teams[0]
  }
  function getKeywords(op: Operative) {
    return op.keywords.split(',').map(s => s.trim()).filter(s => !!s)
  }
  function getArchetypes(op: Operative) {
    return killteams.get(op.killteamId)!.flatMap(kt => (kt.archetypes ?? '').split('/'))
  }
  function getWeaponTraits(op: Operative) {
    let traitsArray = Array.from(
      new Set(
        op.weapons
          .flatMap(w => w
            .profiles
            .flatMap(p => p.WR.split(','))
            .map(s => s.trim())
            .filter(traits => !!traits)
          )
      )
    )
    return traitsArray
  }
  function getWeaponDamages(op: Operative) {
    return Array.from(
      new Set(
        op.weapons
          .flatMap(w => w
            .profiles
            .map(p => p.DMG)
            .filter(dmg => !!dmg)
          )
      )
    )
  }
  function toNumber(value: string): number {
    const match = value.match(/(\d+)/)
    if (match) {
      return parseInt(match[0], 10)
    }
    alert(`Could not parse number from value: ${value}`)
    return 0
  }
  function renderExact(guess: string, correct: string) {
    return guess === correct
      ? '✅'
      : '⬜'
  }
  function renderNumSame(guess: string[], correct: string[]) {
    const [same, numSame] = compareArrays(guess, correct)
    const guessJoin = guess.map(x => x.trim()).filter(x => !!x).join(', ')
    if (same) return '✅'
    if (numSame > 0) return '🟨'
    return '⬜️'
  }
  function renderHighLow(guess: number, correct: number) {
    if (guess === correct) {
      return '✅'
    } else if (guess < correct) {
      return '⬆️'
    } else {
      return '⬇️'
    }
  }

  const strings = ops.map(op => [
    renderExact(op.opTypeName, correctOperative.opTypeName),
    renderNumSame(getKeywords(op), getKeywords(correctOperative)),
    renderNumSame(getArchetypes(op), getArchetypes(correctOperative)),
    renderHighLow(op.APL, correctOperative.APL),
    renderHighLow(toNumber(op.MOVE), toNumber(correctOperative.MOVE)),
    renderHighLow(op.WOUNDS, correctOperative.WOUNDS),
    renderHighLow(toNumber(op.SAVE), toNumber(correctOperative.SAVE)),
    renderHighLow(op.abilities.length, correctOperative.abilities.length),
    renderHighLow(op.weapons.length, correctOperative.weapons.length),
    renderNumSame(getWeaponDamages(op), getWeaponDamages(correctOperative)),
    renderNumSame(getWeaponTraits(op), getWeaponTraits(correctOperative))
  ].join(''))

  return <div className="p-4 bg-white dark:bg-black flex flex-col gap-4 max-w-xl w-11/12 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold text-center text-black dark:text-white">You Win!</h2>
    <p className="text-center">The correct operative was <strong>{correctOperative.opTypeName}</strong>.</p>
    <p className="text-center">Come back tomorrow for a new operative to guess!</p>
    <div className="flex flex-col items-center">
      {ops.map((op, index) =>
        <div key={op.opTypeId}>
          {strings[index]}
        </div>
      )}
    </div>
    <button className="mt-4 px-4 py-2 bg-fuchsia-900 text-white rounded cursor-pointer" onClick={() => {
      // console.log(strings)
      navigator.clipboard.writeText(`I guessed KTdle today in ${strings.length} guesses\n` + strings.join('\n'))
      alert("Results copied to clipboard!")
    }
    }>
      Share results
    </button>
  </div>


}