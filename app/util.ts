'use client'

import { useState } from "react"

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

export function compareArrays<T>(a: T[], b: T[]): [boolean, number] {
    const _a = a.toSorted()
    const _b = b.toSorted()
    let minLength = Math.min(a.length, b.length)
    let numSame = 0
    for (var i = 0; i < minLength; i++) {
        if (_a[i] === _b[i]) {
            numSame++
        }
    }
    return [numSame === _a.length && _a.length === _b.length, numSame]
}

export function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, _setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue
    const stored = localStorage.getItem(key)
    if (!stored) {
      localStorage.clear()
    }
    return stored !== null ? JSON.parse(stored) : defaultValue
  })

  function setValue(newVal: React.SetStateAction<T>) {
    const newValueOrFunction = (typeof newVal === 'function') ? (newVal as (prevState: T) => T)(value) : newVal
    if (!newValueOrFunction) return
    console.log(newValueOrFunction)
    localStorage.setItem(key, JSON.stringify(newValueOrFunction))
    return _setValue(newValueOrFunction)
  }

  return [value, setValue]
}
