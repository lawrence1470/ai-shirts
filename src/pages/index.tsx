import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const createImage = api.example.createImage.useMutation();

  const [imageText, setImageText] = React.useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const response = await createImage.mutateAsync({ text: imageText });
    console.log(response);
    localStorage.setItem("image", response.data.imageUrl);
  };


  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            AI SHIRT APP
          </h1>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center gap-4">
            <label className="text-black">What do you want to make </label>
            <input
              className="w-full rounded-md border border-gray-400 px-4 py-2"
              type="text"
              name="name"
              value={imageText}
              onChange={(e) => setImageText(e.target.value)}
              placeholder="Type in the image you want to create"
            />
            <button
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Create
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
