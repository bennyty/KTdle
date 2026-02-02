import { Operative } from "../killteamjson";
import { killteams } from "../Team";
import { compareArrays } from "../util";


export default function OPTable({ correctOperative, guesses }: { correctOperative: Operative, guesses: Operative[] }) {
  const cellStyles = "p-1 lg:p-2"

  function getKTName(op: Operative) {
    const teams = killteams.get(op.killteamId)!.map(kt => kt.killteamName)
    if (teams.length !== 1) alert(`Operative ${op.opTypeName} has multiple teams: ${teams.join(', ')}`)
    return teams[0]
  }
  function getKeywords(op: Operative) {
    return op.keywords.split(',').map(s => s.trim())
  }
  function getArchetypes(op: Operative) {
    return killteams.get(op.killteamId)!.flatMap(kt => (kt.archetypes ?? '').split('/'))
  }
  function getWeaponTraits(op: Operative) {
    return Array.from(
      new Set(
        op.weapons
          .flatMap(w => w
            .profiles
            .map(p => p.WR)
          )
      )
    )
  }
  function getWeaponDamages(op: Operative) {
    return Array.from(
      new Set(
        op.weapons
          .flatMap(w => w
            .profiles
            .map(p => p.DMG)
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
      ? <span className="text-green-500 font-bold">{guess} ✔</span>
      : <span>{guess}</span>
  }
  function renderNumSame(guess: string[], correct: string[]) {
    const [same, numSame] = compareArrays(guess, correct)
    const guessJoin = guess.map(x => x.trim()).filter(x => !!x).join(', ')
    return same
      ? <span className="text-green-500 font-bold">{guessJoin} ✔</span>
      : <span>{guessJoin} (<span className={numSame > 0 ? "text-orange-500" : ""}>{numSame}</span>)</span>
  }
  function renderHighLow(guess: number, correct: number) {
    if (guess === correct) {
      return <span className="text-green-500 font-bold">{guess} ✔</span>
    } else if (guess < correct) {
      return <span>{guess} ↑</span>
    } else {
      return <span>{guess} ↓</span>
    }
  }

  return <table>
    <thead>
      <tr className={`divide-x divide-gray-500`}>
        <th className={`${cellStyles}`}>Operative</th>
        <th className={`${cellStyles}`}>Keywords</th>
        {/* <th>Team size</th> not int he data!! */}
        <th className={`${cellStyles}`}>Arche&shy;types</th>
        <th className={`${cellStyles}`}>Move</th>
        <th className={`${cellStyles}`}>Wound</th>
        <th className={`${cellStyles}`}>Save</th>
        <th className={`${cellStyles}`}>Base size</th>
        <th className={`${cellStyles}`}>Abilities</th>
        <th className={`${cellStyles}`}>Weapons</th>
        <th className={`${cellStyles}`}>Weapon damages</th>
        <th className={`${cellStyles}`}>Weapon traits</th>
      </tr>
    </thead>

    <tbody>
      {guesses.map((op) =>
        <tr key={op.opTypeId}
          className={`${cellStyles} text-center divide-x divide-gray-500`}
        >
          <td className={cellStyles}>{renderExact(op.opTypeName, correctOperative.opTypeName)}</td>
          <td className={cellStyles}>{renderNumSame(getKeywords(op), getKeywords(correctOperative))}</td>
          <td className={cellStyles}>{renderNumSame(getArchetypes(op), getArchetypes(correctOperative))}</td>
          <td className={cellStyles}>{renderHighLow(toNumber(op.MOVE), toNumber(correctOperative.MOVE))}</td>
          <td className={cellStyles}>{renderHighLow(op.WOUNDS, correctOperative.WOUNDS)}</td>
          <td className={cellStyles}>{renderHighLow(toNumber(op.SAVE), toNumber(correctOperative.SAVE))}</td>
          <td className={cellStyles}>{renderHighLow(op.basesize, correctOperative.basesize)}</td>
          <td className={cellStyles}>{renderHighLow(op.abilities.length, correctOperative.abilities.length)}</td>
          <td className={cellStyles}>{renderHighLow(op.weapons.length, correctOperative.weapons.length)}</td>
          <td className={cellStyles}>{renderNumSame(getWeaponDamages(op), getWeaponDamages(correctOperative))}</td>
          <td className={cellStyles}>{renderNumSame(getWeaponTraits(op), getWeaponTraits(correctOperative))}</td>
        </tr>
      )}
    </tbody>
  </table>
}