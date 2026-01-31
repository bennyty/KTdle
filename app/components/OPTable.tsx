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
    return killteams.get(op.killteamId)!.flatMap(kt => kt.archetypes.split('/'))
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
      ? <td className="text-green-500 font-bold">{guess} ✔</td>
      : <td>{guess}</td>
  }
  function renderNumSame(guess: string[], correct: string[]) {
    const [same, numSame] = compareArrays(guess, correct)
    const guessJoin = guess.join(', ')
    return same
      ? <td className="text-green-500 font-bold">{guessJoin} ✔</td>
      : <td>{guessJoin} ({numSame})</td>
  }
  function renderHighLow(guess: number, correct: number) {
    if (guess === correct) {
      return <td className="text-green-500 font-bold">{guess} ✔</td>
    } else if (guess < correct) {
      return <td>{guess} ↑</td>
    } else {
      return <td>{guess} ↓</td>
    }
  }

  return <table>
    <thead>
      <tr>
        <th>Operative name</th>
        <th>Team name</th>
        {/* <th>Team size</th> not int he data!! */}
        <th>Archetypes</th>
        <th>Move</th>
        <th>Wound</th>
        <th>Save</th>
        {/* <th>Base size</th> */}
        <th># of abilities</th>
        <th># of weapons</th>
        <th>Weapon traits</th>
      </tr>
    </thead>
    <tbody
      className="text-center"
    >
      {guesses.toReversed().map((op) =>
        <tr key={op.opTypeId}>
          {renderExact(op.opTypeName, correctOperative.opTypeName)}
          {renderExact(getKTName(op), getKTName(correctOperative))}
          {renderNumSame(getArchetypes(op), getArchetypes(correctOperative))}
          {renderHighLow(toNumber(op.MOVE), toNumber(correctOperative.MOVE))}
          {renderHighLow(op.WOUNDS, correctOperative.WOUNDS)}
          {renderHighLow(toNumber(op.SAVE), toNumber(correctOperative.SAVE))}
          {/* {renderHighLow(op.basesize, correctOperative.basesize)} */}
          {renderHighLow(op.abilities.length, correctOperative.abilities.length)}
          {renderHighLow(op.weapons.length, correctOperative.weapons.length)}
          {renderNumSame(getWeaponTraits(op), getWeaponTraits(correctOperative))}
        </tr>
      )}
    </tbody>
  </table>
}