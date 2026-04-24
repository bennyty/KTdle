import { Fragment, useEffect, useState } from "react";
import { Operative } from "../killteamjson";
import { getSanitizedWR, operatives } from "../Team";
import { compareArrays, getAbilities, getArchetypes, getKeywords, getWeaponDamages, getWeaponTraits, toNumber } from "../util";
import Modal from "@mui/material/Modal";


export default function OPTableMobile({ correctOperative, guesses }: { correctOperative: Operative, guesses: string[] }) {
  const cellStyles = "p-0.5 lg:p-1"

  const ops = guesses.map(name => operatives.get(name)!).filter(op => !!op)

  function renderNumSame(guess: string[], correct: string[]) {
    const [same, numSame] = compareArrays(guess.map(getSanitizedWR), correct.map(getSanitizedWR))
    const guessJoin = guess.map(x => x.trim()).filter(x => !!x).join(', ')
    return same
      ? <span className="text-primary font-bold">{guessJoin} ✔</span>
      : <span>{guessJoin} (<span className={numSame > 0 ? "text-amber-500" : ""}>{numSame}</span>)</span>
  }
  function renderHighLow(guess: number, correct: number) {
    if (guess === correct) {
      return <span className="text-primary font-bold">{guess} ✔</span>
    } else if (guess < correct) {
      return <span>{guess} ↑</span>
    } else {
      return <span>{guess} ↓</span>
    }
  }
  function renderNumSameMobile(guess: string[], correct: string[]) {
    const [same, numSame] = compareArrays(guess.map(getSanitizedWR), correct.map(getSanitizedWR))
    return same
      ? <span className="text-primary font-bold">✔</span>
      : <span className={numSame > 0 ? "text-amber-500" : ""}>{numSame}</span>
  }
  function renderHighLowMobile(guess: number, correct: number) {
    if (guess === correct) {
      return <span className="text-primary font-bold">{guess}✔</span>
    } else if (guess < correct) {
      return <span>{guess}↑</span>
    } else {
      return <span>{guess}↓</span>
    }
  }

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [detailsOp, setDetailsOp] = useState<Operative | null>(null)
  function openDetails(op: Operative) {
    return () => {
      setDetailsOp(op)
      setDetailsOpen(true)
    }
  }

  return <>
    <span className="text-sm text-foreground">Mobile condensed view: tap an operative to see full details</span>
    <table>
      <thead>
        <tr className={`divide-x divide-border`}>
          <th className={`${cellStyles}`}>KW</th>
          {/* <th>Team size</th> not int he data!! */}
          <th className={`${cellStyles}`}>Arch</th>
          <th className={`${cellStyles}`}>APL</th>
          <th className={`${cellStyles}`}>Mv</th>
          <th className={`${cellStyles}`}>Wo</th>
          <th className={`${cellStyles}`}>Sv</th>
          {/* <th className={`${cellStyles}`}>Base size</th> */}
          <th className={`${cellStyles} cursor-help`}
            title="INCLUDES Faction Abilities due to data limitations">Abils</th>
          <th className={`${cellStyles}`}>Wep</th>
          <th className={`${cellStyles}`}>Dmg</th>
          <th className={`${cellStyles}`}>Traits</th>
        </tr>
      </thead>

      <tbody>
        {isClient && ops.map((op) =>
          <Fragment key={op.opTypeId}>
            <tr key={op.opTypeId + "-1"} onClick={openDetails(op)}>
              <td colSpan={10} className="text-left text-sm">{op.opTypeName}</td>
            </tr>
            <tr key={op.opTypeId + "-2"} onClick={openDetails(op)}
              className={`${cellStyles} text-center divide-x divide-border`}
            >
              <td className={cellStyles}>{renderNumSameMobile(getKeywords(op), getKeywords(correctOperative))}</td>
              <td className={cellStyles}>{renderNumSameMobile(getArchetypes(op), getArchetypes(correctOperative))}</td>
              <td className={cellStyles}>{renderHighLowMobile(op.APL, correctOperative.APL)}</td>
              <td className={cellStyles}>{renderHighLowMobile(toNumber(op.MOVE), toNumber(correctOperative.MOVE))}</td>
              <td className={cellStyles}>{renderHighLowMobile(op.WOUNDS, correctOperative.WOUNDS)}</td>
              <td className={cellStyles}>{renderHighLowMobile(toNumber(op.SAVE), toNumber(correctOperative.SAVE))}</td>
              <td className={cellStyles}>{renderHighLowMobile(getAbilities(op).length, getAbilities(correctOperative).length)}</td>
              <td className={cellStyles}>{renderHighLowMobile(op.weapons.length, correctOperative.weapons.length)}</td>
              <td className={cellStyles}>{renderNumSameMobile(getWeaponDamages(op), getWeaponDamages(correctOperative))}</td>
              <td className={cellStyles}>{renderNumSameMobile(getWeaponTraits(op), getWeaponTraits(correctOperative))}</td>
            </tr>
          </Fragment>
        )}
      </tbody>
    </table>
    {detailsOp && <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)}>
      <div className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          p-6 bg-surface
          flex flex-col gap-4
          max-w-full w-11/12
          border border-border rounded-lg shadow-2xl outline-none">
        <h1 className="text-xl font-bold text-primary">{detailsOp.opTypeName}</h1>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="font-bold">Keywords:</span>
            <span>{renderNumSame(getKeywords(detailsOp), getKeywords(correctOperative))}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Archetypes:</span>
            <span>{renderNumSame(getArchetypes(detailsOp), getArchetypes(correctOperative))}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">APL:</span>
            <span>{renderHighLow(detailsOp.APL, correctOperative.APL)}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Move:</span>
            <span>{renderHighLow(toNumber(detailsOp.MOVE), toNumber(correctOperative.MOVE))}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Wounds:</span>
            <span>{renderHighLow(detailsOp.WOUNDS, correctOperative.WOUNDS)}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Save:</span>
            <span>{renderHighLow(toNumber(detailsOp.SAVE), toNumber(correctOperative.SAVE))}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Abilities & Faction Rules:</span>
            <span>{renderHighLow(getAbilities(detailsOp).length, getAbilities(correctOperative).length)}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Weapons:</span>
            <span>{renderHighLow(detailsOp.weapons.length, correctOperative.weapons.length)}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Weapon damages:</span>
            <span>{renderNumSame(getWeaponDamages(detailsOp), getWeaponDamages(correctOperative))}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Weapon traits:</span>
            <span>{renderNumSame(getWeaponTraits(detailsOp), getWeaponTraits(correctOperative))}</span>
          </div>
        </div>
      </div>
    </Modal>}
  </>
}