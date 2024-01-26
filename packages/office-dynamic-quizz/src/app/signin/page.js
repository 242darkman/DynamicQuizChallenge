'use client';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Oups, il semblerait que vous ayez oublié de remplir un champ (ou deux). Merci de les compléter !");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Hmm, cet email a l'air d'être un peu trop créatif. Veuillez entrer une adresse valide.");

      return;
    }

    const loadingToast = toast.loading("Juste un instant, nous faisons tourner la roue de la fortune de la connexion...");

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        toast.error("Erreur de connexion. Même internet semble jouer à cache-cache parfois !");
        throw new Error('Erreur de connexion');
      }

      const data = await response.json();
      localStorage.setItem('app_token', data.access_token);
      toast.dismiss(loadingToast);
      toast.success("Bingo ! Connexion réussie. Bienvenue dans votre nouvelle aventure !");
      router.push('/');

    } catch (error) {
      toast.error(error.message || "Oups, un petit souci technique... Notre équipe de ninjas est sur le coup !");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-7 bg-white/30 backdrop-blur-sm rounded shadow-lg w-1/2 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800">Connexion</h2>
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
            type="submit"
            className="w-1/2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:ring focus:ring-blue-300"
          >
            Se connecter
          </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-800">
          Pas encore de compte ? <a href="/signup" className="text-blue-500 hover:underline">Créer un compte</a>
        </p>
      </div>
    </div>
  )
}
