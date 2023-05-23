"use client";
import { NextResponse } from "next/server";
import { useState, ChangeEvent, FormEvent } from "react";

interface Prompt {
  prompt: string;
}

interface Result {
  result: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState<Prompt>({ prompt: "" });
  const [result, setResult] = useState<Result>();
  const [loading, setLoading] = useState<boolean>(false);
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.prompt }),
      });
      const data: Result = await response.json();

      setResult(data);
    } catch (error: any) {
      alert(error.message);
    }
    setLoading(false);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt({ prompt: e.target.value });
  };

  return (
    <div className="bg-zinc-950 h-screen flex justify-center items-center">
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          placeholder="Enter a prompt"
          type="text"
          className="p-2 block bg-neutral-700 text-white w-full rounded-md"
        />
        <button
          type="submit"
          className="bg-green-500 p-2 rounded-md block mt-2 text-white disabled:opacity-50"
          disabled={!prompt || loading}
        >
          {loading ? "Loading ..." : "Generate"}
        </button>
        {result && (
          <p className="text-xl font-bold text-white max-w-xs my-10">
            {result.toString()}
          </p>
        )}
      </form>
    </div>
  );
}
