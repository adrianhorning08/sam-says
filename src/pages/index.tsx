import Head from "next/head";
import Image from "next/image";
import { Outfit } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

const outfit = Outfit({ subsets: ["latin"] });

export default function Home() {
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [askOrTweet, setAskOrTweet] = useState<"ask" | "tweet">("ask");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function askQuestion(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setAnswer("");
      setIsLoading(true);
      const res = await fetch("/api/ask", {
        method: "POST",
        body: JSON.stringify({ question, type: askOrTweet }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setAnswer(data);
    } catch (error) {
      // @ts-ignore
      console.log("error at askQuestion", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sam says</title>
        <meta name="description" content="Tweet like Sam Parr" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`flex flex-col ${outfit.className} justify-center items-center py-8 px-8`}
      >
        <h1 className="text-4xl md:text-8xl text-center">
          Ask AI Sam Parr a question
        </h1>
        <div className="flex items-center flex-col py-8">
          <Image
            className="rounded-full"
            src="/sam.jpeg"
            width={200}
            height={200}
            alt="sam"
          />

          <div className="group-btns w-full flex justify-center py-8">
            <button
              onClick={() => {
                setAskOrTweet("ask");
                setQuestion("");
                setAnswer("");
              }}
              className="mr-2 rounded-md bg-indigo-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Ask Sam a question
            </button>
            <button
              onClick={() => {
                setAskOrTweet("tweet");
                setQuestion("");
                setAnswer("");
              }}
              className="ml-2 rounded-md bg-indigo-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Tweet like Sam
            </button>
          </div>

          <div className="w-full">
            <form onSubmit={askQuestion} className="flex flex-col w-full">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                type="text"
                id="question"
                placeholder={
                  askOrTweet === "ask"
                    ? "Ask Sam a question"
                    : "Enter a topic to tweet about"
                }
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-4"
              />
              <button
                type="submit"
                className="rounded-md bg-indigo-600 py-2.5 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </form>

            <div className="mt-4 w-full">{answer}</div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-center text-4xl md:text-7xl mb-8">
            Who Made This?
          </h2>
          <p>
            This was made by{" "}
            <a
              className="text-blue-500"
              href="https://twitter.com/adrian_horning_"
              target="_blank"
              rel="noreferrer"
            >
              @adrian_horning_
            </a>
            I made this because I love to scrape, and also wanted to learn how
            to use the OpenAI API.
            <br />
            {`I scraped Sam's tweets and trained an AI model on them.`}
            <br />
            <br />
            I seperated them into replies, and actual tweets. I only trained the
            AI on ~300 of his tweets, because I had to manually go through and
            write a prompt for each one.
            <br />
            <br />
            But used all his replies as training data for answering questions.
            <br />
            <br />
            {`Here is the training data if you're interested: `}
            <a
              className="text-blue-500"
              href="https://gist.github.com/adrianhorning08/6f96ef07ea2a29fc5668ce9c82c42a4f"
              target="_blank"
              rel="noreferrer"
            >
              {`Sam's training data`}
            </a>
            <br />
            <br />
            {`Ngl, sometimes you get some crazy answers with this. This is my first time using
            the OpenAI API, so I'm sure there's a lot of room for improvement.`}
            <br />
            <br />
            {`I'm running a web scraping agency currently. If you need something scraped, DM me on Twitter, or
            send an email to: m.adrian.horning at gmail`}
          </p>
        </div>
      </main>
    </>
  );
}
