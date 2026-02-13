'use client';
import OPTable from "../components/OPTable";
import { operatives } from "../Team";

export default function DebugPage() {
    return <div>
        "Hearthkyn Warrior"
        <OPTable correctOperative={operatives.get("Hearthkyn Warrior")!} guesses={[""]}></OPTable>
    </div>
}