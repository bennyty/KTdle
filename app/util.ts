import { useState } from "react"
import { Operative } from "./killteamjson"
import { killteams } from "./Team"

// Hash function 
// Public domain https://github.com/bryc/code/blob/master/jshash/PRNGs.md
export function cyrb128(str: string) {
  let h1 = 1779033703, h2 = 3144134277,
    h3 = 1013904242, h4 = 2773480762
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i)
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067)
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233)
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213)
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179)
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067)
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233)
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213)
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179)
  h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0]
}

export function compareArrays<T>(a: string[], b: string[]): [boolean, number] {
  const _a = new Set(a.map(x => x.trim()).filter(x => !!x))
  const _b = new Set(b.map(x => x.trim()).filter(x => !!x))
  const intersection = _a.intersection(_b)
  let numSame = intersection.size
  return [numSame === a.length && a.length === b.length, numSame]
}

export function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, _setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue
    const stored = localStorage.getItem(key)
    if (!stored) {
      return defaultValue
    }
    return JSON.parse(stored)
  })

  function setValue(newVal: React.SetStateAction<T>) {
    const newValueOrFunction = (typeof newVal === 'function') ? (newVal as (prevState: T) => T)(value) : newVal
    if (!newValueOrFunction) return
    localStorage.setItem(key, JSON.stringify(newValueOrFunction))
    return _setValue(newValueOrFunction)
  }

  return [value, setValue]
}

export function getKTName(op: Operative) {
  const teams = killteams.get(op.killteamId)!.map(kt => kt.killteamName)
  if (teams.length !== 1) alert(`Operative ${op.opTypeName} has multiple teams: ${teams.join(', ')}`)
  return teams[0]
}
export function getKeywords(op: Operative) {
  return op.keywords.split(',').map(s => s.trim()).filter(s => !!s)
}
export function getArchetypes(op: Operative) {
  return killteams.get(op.killteamId)!.flatMap(kt => (kt.archetypes ?? '').split('/'))
}
export function getWeaponTraits(op: Operative) {
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
export function getWeaponDamages(op: Operative) {
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
export function getAbilities(op: Operative) {
  return op.abilities//.filter(a => !a.isFactionAbility)
}
export function toNumber(value: string): number {
  const match = value.match(/(\d+)/)
  if (match) {
    return parseInt(match[0], 10)
  }
  alert(`Could not parse number from value: ${value}`)
  return 0
}