import { error } from "console";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!configuration.apiKey) {
  throw new Error("OPENAI_API_KEY is required");
}

const openai = new OpenAIApi(configuration);

export async function POST(req) {
  const body = await req.json();

  if (!body.prompt || !body.prompt.length === 0) {
    return NextResponse.error(new Error("Prompt is required"), {
      status: 400,
    });
  }
  try {
    const response = await openai.createCompletion({
      prompt: body.prompt,
      model: "text-davinci-003",
      temperature: 0.7,
      max_tokens: 250,
    });
    return NextResponse.json(response.data.choices[0].text);
  } catch (e) {
    return NextResponse.error(error, { status: 500 });
  }
}
