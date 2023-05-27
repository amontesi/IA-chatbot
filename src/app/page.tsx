"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import "./styles.css";

interface Prompt {
  prompt: string;
}

interface Result {
  result: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState<Prompt>({ prompt: "" });
  const [result, setResult] = useState<Result | null>(null);
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

      if (!response.ok) {
        throw new Error("Request failed. Please try again.");
      }

      const data: Result = await response.json();
      setResult(data);
    } catch (error) {
      alert((error as Error).message);
    }

    setLoading(false);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt({ prompt: e.target.value });
  };

  const formatResponse = (response: Result | any) => {
    const days = response?.split("\n\n");

    return (
      <div>
        {days?.map((day: string, index: number) => (
          <p key={index}>{day.trim()}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Proyecto IA</h1>
      </div>
      <div className="content">
        <form onSubmit={onSubmit} className="form">
          <input
            onChange={onChange}
            placeholder="Enter a prompt"
            type="text"
            className="input"
          />
          <button
            type="submit"
            className="button"
            disabled={!prompt.prompt || loading}
          >
            {loading ? "Loading..." : "Generate"}
          </button>
        </form>
        {result && (
          <div className="result-box">
            <div className="result">{formatResponse(result)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
