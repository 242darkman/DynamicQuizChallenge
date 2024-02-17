"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from '@/app/_context/AuthContext';
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error(
        "Oups, il semblerait que vous ayez oublié de remplir un champ (ou deux). Merci de les compléter !"
      );
      return;
    }

    if (!validateEmail(email)) {
      toast.error(
        "Hmm, cet email a l'air d'être un peu trop créatif. Veuillez entrer une adresse valide."
      );

      return;
    }

    const loadingToast = toast.loading(
      "Juste un instant, nous faisons tourner la roue de la fortune de la connexion..."
    );

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        toast.error(
          "Erreur de connexion. Même internet semble jouer à cache-cache parfois !"
        );
        throw new Error("Erreur de connexion");
      }

      const data = await response.json();
      toast.dismiss(loadingToast);
      toast.success(
        "Bingo ! Connexion réussie. Bienvenue dans votre nouvelle aventure !"
      );
      login(data.access_token);
      
    } catch (error) {
      toast.error(
        error.message ||
          "Oups, un petit souci technique... Notre équipe de ninjas est sur le coup !"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-mainColor bg-[url('/landscape.svg')] bg-cover bg-center">
      <div className="p-12 bg-white/100 backdrop-blur-sm rounded shadow-lg w-1/2 border">
        <h2 className="text-2xl font-bold text-center text-mainColor">
          Connexion
        </h2>
        <form className="space-y-10 mt-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-mainColor">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-secondColor bg-white text-mainColor"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
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
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-1/2 px-4 py-2 text-white bg-mainColor rounded hover:bg-secondColor focus:ring focus:ring-blue-300"
            >
              Se connecter
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-800">
          Pas encore de compte ?{" "}
          <a href="/auth/signup" className="text-secondColor hover:underline">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}
