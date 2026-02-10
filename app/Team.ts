import { Killteam, Operative, } from "./killteamjson"
import kt24_raw from './kt24_v4.json'
import specials_raw from './specials.json'
const kt24 = kt24_raw as Killteam[]

const DEFAULT_URL = 'https://raw.githubusercontent.com/vjosset/killteamjson/refs/heads/main/kt24_v4.json'
export async function loadKillTeamJson(url = DEFAULT_URL) {
    // const res = await fetch(url, {cache: 'force-cache'} )
    // if (!res.ok) throw new Error(`Failed to load JSON: ${res.status} ${res.statusText}`)
    // const data = await res.json() as Killteam[]
    return kt24
}

function isIncludedTeam(killteam: Killteam) {
    if (killteam.isHomebrew) return false // All the homebrew teams
    if (killteam.factionId === 'SPEC') return false // Titus Misison Pack and NPOs
    if (killteam.killteamId === 'IMP-SFV') return false // Strike Force Variel
    return true
}
function isIncludedOperative(operative: Operative) {
    if (operative.killteamId === "IMP-INQ" && !operative.opTypeId.startsWith("IMP-INQ-INQ24")) return false
    return true
}

export const data = await loadKillTeamJson()
export const operatives =
    new Map(
        data
            .filter(isIncludedTeam)
            .flatMap(kt =>
                kt.opTypes
                    .filter(isIncludedOperative)
                    .map(op => [op.opTypeName, op]))
    )

const specials = new Map(specials_raw.map(s => [cleanWR(s.code), s.ruleName]))
function cleanWR(wr: string): string {
    return wr.replaceAll(" ", "").toUpperCase()
}
export function getSanitizedWR(wr: string): string {
    const clean = cleanWR(wr)
    return specials.get(clean) ?? clean
}

export const operativeNames = Array.from(operatives.keys()).sort()

export const killteams =
    Map.groupBy(data, kt => kt.killteamId)