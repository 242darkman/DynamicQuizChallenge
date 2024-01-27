import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen p-24 bg-mainColor flex items-center justify-center flex-col">
      <div>
        <h1 className="text-5xl">DynamicQuizChallenge</h1>
        <p>une expérience de jeu personnalisée et dynamique</p>
      </div>
      <div className="flex items-center justify-center gap-10 m-10">
        <a
          href="/signup"
          className="w-1/2 px-4 py-2 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor"
        >
          S&#39;inscrire
        </a>
        <a
          href="/signin"
          className="w-1/2 px-4 py-2 text-mainColor bg-white rounded hover:bg-secondColor focus:ring focus:ring-secondColor  w-full"
        >
          Se connecter
        </a>
      </div>
    </main>
  );
}
