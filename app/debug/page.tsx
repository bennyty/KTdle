'use client';
import OPTable from "../components/OPTableMobile";
import { operatives } from "../Team";

let sharedGuesses = ["Battleclade Technoarcheologist", "Gunner", "Goremonger Blood Herald"]

let cases = ["Reliquarius", "Ratling Sneak"]

export default function DebugPage() {
    return <div>
        {cases.map(c =>
            <div key={c}>
                "{c}"
                <OPTable correctOperative={operatives.get(c)!} guesses={sharedGuesses.concat([c])}></OPTable>
            </div>
        )}
    </div>
}