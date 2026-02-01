import { useState } from "react";
import OperativeCard from "./OperativeCard";

interface GuessFormProps {
  submitGuess: (formData: any) => void;
  preview: (e: React.ChangeEvent<HTMLInputElement>) => void;
  operativeNames: string[];
}
export default function GuessForm({ submitGuess, preview, operativeNames }: GuessFormProps) {

  return (
    <div>
      <form action={submitGuess}
        className="flex max-w-lg gap-2">
        <input type="text"
          name="operative"
          placeholder="Guess an operative"
          list="operatives-list"
          className="grow w-full rounded box-border border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          onChange={preview}
        />
        <datalist id="operatives-list">
          {operativeNames.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <button
          className="px-6
        rounded font-medium text-white
        whitespace-nowrap
        bg-red-500 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Submit Guess
        </button>
      </form>
    </div>
  )
}