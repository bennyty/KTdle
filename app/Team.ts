import { Killteam, Operative, } from "./killteamjson"
import kt24_raw from './kt24_v4.json'
const kt24 = kt24_raw as Killteam[]

const DEFAULT_URL = 'https://raw.githubusercontent.com/vjosset/killteamjson/refs/heads/main/kt24_v4.json'
export async function loadKillTeamJson(url = DEFAULT_URL) {
    // const res = await fetch(url, {cache: 'force-cache'} )
    // if (!res.ok) throw new Error(`Failed to load JSON: ${res.status} ${res.statusText}`)
    // const data = await res.json() as Killteam[]
    return kt24
}

function isIncludedTeam(killteam: Killteam) {
    if (killteam.isHomebrew) return false
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
// console.log(Array.from(operatives.keys()).length, new Set(operatives.keys()).size)
export const operativeNames = Array.from(operatives.keys()).sort()

export const killteams =
    Map.groupBy(data, kt => kt.killteamId)