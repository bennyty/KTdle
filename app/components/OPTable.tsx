import { Operative } from "../killteamjson";
import { killteams } from "../Team";
import { compareArrays } from "../util";


export default function OPTable({ correctOperative, guesses }: { correctOperative: Operative, guesses: Operative[] }) {
  function getKTName(op: Operative) {
    const teams = killteams.get(op.killteamId)!.map(kt => kt.killteamName)
    if (teams.length !== 1) alert(`Operative ${op.opTypeName} has multiple teams: ${teams.join(', ')}`)
    return teams[0]
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
      ? <td className="p-2 text-green-500 font-bold">{guess} ✔</td>
      : <td className="p-2">{guess}</td>
  }
  function renderNumSame(guess: string[], correct: string[]) {
    const [same, numSame] = compareArrays(guess, correct)
    const guessJoin = guess.map(x => x.trim()).join(', ')
    return same
      ? <td className="p-2 text-green-500 font-bold">{guessJoin} ✔</td>
      : <td className="p-2">{guessJoin} (<span className={numSame > 0 ? "text-orange-500" : ""}>{numSame}</span>)</td>
  }
  function renderHighLow(guess: number, correct: number) {
    if (guess === correct) {
      return <td className="p-2 text-green-500 font-bold">{guess} ✔</td>
    } else if (guess < correct) {
      return <td className="p-2">{guess} ↑</td>
    } else {
      return <td className="p-2">{guess} ↓</td>
    }
  }

  return <table>
    <thead>
      <tr className="divide-x divide-gray-500">
        <th className="p-2">Operative name</th>
        <th className="p-2">Team name</th>
        {/* <th>Team size</th> not int he data!! */}
        <th className="p-2">Archetypes</th>
        <th className="p-2">Move</th>
        <th className="p-2">Wound</th>
        <th className="p-2">Save</th>
        <th className="p-2">Base size</th>
        <th className="p-2"># of abilities</th>
        <th className="p-2"># of weapons</th>
        <th className="p-2">Weapon damages</th>
        <th className="p-2">Weapon traits</th>
      </tr>
    </thead>

    <tbody>
      {guesses.toReversed().map((op) =>
        <tr key={op.opTypeId} className="p-2 text-center divide-x divide-gray-500">
          {renderExact(op.opTypeName, correctOperative.opTypeName)}
          {renderExact(getKTName(op), getKTName(correctOperative))}
          {renderNumSame(getArchetypes(op), getArchetypes(correctOperative))}
          {renderHighLow(toNumber(op.MOVE), toNumber(correctOperative.MOVE))}
          {renderHighLow(op.WOUNDS, correctOperative.WOUNDS)}
          {renderHighLow(toNumber(op.SAVE), toNumber(correctOperative.SAVE))}
          {renderHighLow(op.basesize, correctOperative.basesize)}
          {renderHighLow(op.abilities.length, correctOperative.abilities.length)}
          {renderHighLow(op.weapons.length, correctOperative.weapons.length)}
          {renderNumSame(getWeaponDamages(op), getWeaponDamages(correctOperative))}
          {renderNumSame(getWeaponTraits(op), getWeaponTraits(correctOperative))}
        </tr>
      )}
    </tbody>
  </table>
}