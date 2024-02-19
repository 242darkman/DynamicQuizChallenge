"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const router = useRouter();

  const checkUsername = async (username) => {
    const response = await fetch(
      `http://127.0.0.1:5000/api/users/check-username?username=${username}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://127.0.0.1:5000',
        },
      }
    );
    const data = await response.json();
    setUsernameAvailable(!data.exists);
  };

  const checkEmail = async (email) => {
    const response = await fetch(
      `http://127.0.0.1:5000/api/users/check-email?email=${email}`
    );
    const data = await response.json();
    setEmailAvailable(!data.exists);
  };

  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !email || !password || !passwordsMatch) {
      toast.error("Veuillez remplir correctement tous les champs.");
      return;
    }

    const loadingToast = toast.loading(
      "Patientez un petit moment, nous orchestrons votre accueil en coulisses... 🎩✨"
    );

    try {
      const response = await fetch("http://127.0.0.1:5000/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        toast.error("Erreur lors de l'inscription");
        throw new Error("Erreur lors de l'inscription");
      }

      toast.dismiss(loadingToast);
      toast.success(
        "Félicitations, vous êtes maintenant membre de notre club exclusif ! 🥳 Préparez-vous, votre aventure épique commence... juste après cette pause café. ☕"
      );
      router.push("/auth/signin");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        error.message || "Une erreur est survenue lors de l'inscription."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-mainColor bg-[url('/landscape.svg')] bg-cover bg-center">
      <div className="p-12 bg-white/100 backdrop-blur-sm rounded shadow-lg w-1/2 border">
        <h2 className="text-2xl font-bold text-center text-mainColor">
          Inscription
        </h2>
        <form className="space-y-4 mt-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-mainColor">
              Nom d&#39;utilisateur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-secondColor  bg-white text-mainColor"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                checkUsername(e.target.value);
              }}
            />
            {usernameAvailable !== null && (
              <span style={{ color: usernameAvailable ? "green" : "red" }}>
                {usernameAvailable
                  ? "Nom d'utilisateur disponible"
                  : "Nom d'utilisateur déjà pris"}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-mainColor">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-secondColor bg-white text-mainColor"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                checkEmail(e.target.value);
              }}
            />
            {emailAvailable !== null && (
              <span style={{ color: emailAvailable ? "green" : "red" }}>
                {emailAvailable ? "Email disponible" : "Email déjà utilisé"}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-mainColor">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-secondColor bg-white text-mainColor"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-mainColor">
              Confirmez le mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-secondColor  bg-white text-mainColor"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!passwordsMatch && (
              <span style={{ color: "red" }}>
                Les mots de passe ne correspondent pas
              </span>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-1/2 px-4 py-2 text-white bg-mainColor rounded hover:bg-secondColor focus:ring focus:ring-blue-300"
            >
              S&#39;inscrire
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-800">
          Vous avez déjà un compte ?{" "}
          <a href="/auth/signin" className="text-secondColor hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
