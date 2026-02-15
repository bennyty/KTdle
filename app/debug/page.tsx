'use client';
import OPTable from "../components/OPTable";
import { operatives } from "../Team";

export default function DebugPage() {
    return <div>
        "Reliquarius"
        <OPTable correctOperative={operatives.get("Reliquarius")!} guesses={["Battleclade Technoarcheologist", "Reliquarius"]}></OPTable>
        "Ratling Sneak"
        <OPTable correctOperative={operatives.get("Ratling Sneak")!} guesses={["Battleclade Technoarcheologist", "Ratling Sneak"]}></OPTable>
    </div>
}