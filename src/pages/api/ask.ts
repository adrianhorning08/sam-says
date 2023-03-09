// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { question, type } = req.body;
    console.log(question);

    let prompt = "";

    if (type === "ask") {
      prompt = `Respond to this like @thesamparr would: ${question}.\n\n###\n\n`;
    } else {
      prompt = `Compose a twitter thread in the style of @thesamparr based on this topic: ${question}.\n\n###\n\n`;
    }

    const response = await openai.createCompletion({
      model: "curie:ft-personal-2023-03-09-19-12-26",
      prompt,
      max_tokens: 200,
      stop: ["###"],
    });

    console.log(response.data.choices);

    // @ts-ignore
    res.status(200).json(response.data.choices[0].text);
  } catch (error) {
    // @ts-ignore
    console.log("error at ask.ts", error.message);
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
}
