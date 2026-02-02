import type { Operative, WeaponProfile } from "../killteamjson"

function joinUnique(arr: string[]) {
    return Array.from(new Set(arr.flatMap(s => (s ?? "").split(",").map(x => x.trim()).filter(Boolean))))
}

function renderWRForProfile(p: WeaponProfile) {
    return p.WR && p.WR.trim() !== "" ? p.WR : "—"
}

export default function OperativeCard({ operative }: { operative: Operative }) {
    if (!operative) {
        return (
            <article className="w-full flex flex-col aspect-3/1 bg-gray-800 text-gray-100 rounded-lg shadow-lg ring-1 ring-black/10 overflow-hidden">
                <div className="flex justify-between items-center gap-4 bg-gray-900 border-b-4 border-orange-500 p-4">
                    <h2 className="text-xl font-bold uppercase">Guess Preview</h2>
                </div>
                <div className="flex grow items-center justify-center">
                    This is a preview of the operative you're about to guess.
                </div>
            </article>
        )
    }

    const weaponProfiles = operative.weapons.flatMap(w => w.profiles.map(p => ({ wepName: w.wepName, profile: p })))

    return (
        <article className="w-full bg-gray-800 text-gray-100 rounded-lg shadow-lg ring-1 ring-black/10 overflow-hidden">
            {/* Top band */}
            <div className="flex justify-between items-center gap-4
        bg-gray-900 border-b-4 border-orange-500 p-4">
                <h2 className="text-xl font-bold uppercase">{operative.opTypeName}</h2>

                {/* Stat badges */}
                <div className="flex gap-2 items-center">
                    <div className="flex flex-col items-center p-2 bg-gray-800/70 rounded border border-gray-700">
                        <span className="text-xs text-gray-300">APL</span>
                        <span className="text-lg font-bold text-orange-400">{operative.APL}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-800/70 rounded border border-gray-700">
                        <span className="text-xs text-gray-300">MOVE</span>
                        <span className="text-lg font-bold text-orange-400">{operative.MOVE}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-800/70 rounded border border-gray-700">
                        <span className="text-xs text-gray-300">SAVE</span>
                        <span className="text-lg font-bold text-orange-400">{operative.SAVE}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-800/70 rounded border border-gray-700">
                        <span className="text-xs text-gray-300">WOUNDS</span>
                        <span className="text-lg font-bold text-orange-400">{operative.WOUNDS}</span>
                    </div>
                </div>
            </div>

            {/* Weapons table */}
            <section className="p-4">
                <table className="w-full rounded-md text-center">
                    <thead>
                        <tr className="bg-gray-700/60 text-sm text-gray-200 uppercase font-semibold px-4 py-2 items-center">
                            <th>NAME</th>
                            <th>ATK</th>
                            <th>HIT</th>
                            <th>DMG</th>
                            <th>Weapon Rules</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {weaponProfiles.map(({ wepName, profile }) => (
                            <tr key={profile.wepprofileId}>
                                <td>{wepName}</td>
                                <td>{profile.ATK}</td>
                                <td>{profile.HIT}</td>
                                <td>{profile.DMG}</td>
                                <td>{renderWRForProfile(profile)}</td>
                            </tr>
                        ))}
                    </tbody>

                    {operative.weapons.length === 0 && (
                        <div className="px-4 py-4 text-sm text-gray-400">No weapons listed</div>
                    )}
                </table>
            </section>

            {/* Abilities / Options / Footer */}
            <section className="px-4 pb-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-200 mb-2">Abilities</h3>
                        <div className="space-y-3 text-sm text-gray-300">
                            {operative.abilities.length > 0 ? operative.abilities.map(a => (
                                <div key={a.abilityId}>
                                    <div className="font-semibold text-gray-100">{a.abilityName}{a.AP !== null ? ` — ${a.AP}` : ""}</div>
                                    {/* <div className="text-gray-300">{a.description}</div> */}
                                </div>
                            )) : <div className="text-gray-400">No abilities</div>}
                        </div>
                    </div>

                    <div className="w-64">
                        <h3 className="text-sm font-semibold text-gray-200 mb-2">Options</h3>
                        <div className="text-sm text-gray-300 space-y-2">
                            {operative.options.length > 0 ? operative.options.map(o => (
                                <div key={o.optionId} className="p-2 bg-gray-800/60 rounded border border-gray-700">
                                    <div className="font-semibold text-gray-100">{o.optionName}</div>
                                    <div className="text-gray-300 text-xs">{o.description}</div>
                                </div>
                            )) : <div className="text-gray-400">No options</div>}
                        </div>
                    </div>
                </div>

                <footer className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
                    <p className="text-xs text-gray-300 mt-1">{operative.keywords}</p>
                </footer>
            </section>
        </article>
    )
}