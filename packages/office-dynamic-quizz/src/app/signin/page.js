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
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("L'email n'est pas valide.");
      return;
    }

    const loadingToast = toast.loading("Un instant, nous vérifions vos informations...");

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        toast.error('Erreur de connexion');
        throw new Error('Erreur de connexion');
      }

      const data = await response.json();
      localStorage.setItem('app_token', data.access_token);
      toast.dismiss(loadingToast);
      toast.success("Connexion réussie !");
      router.push('/');

    } catch (error) {
      toast.error(error.message || "Une erreur est survenue lors de la connexion.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-7 bg-white rounded shadow-md w-1/2">
        <h2 className="text-2xl font-bold text-center">Connexion</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Se connecter
          </button>
        </form>
        <p className="mt-4 text-center">
          Pas encore de compte ? <a href="/signup" className="text-blue-500 hover:underline">Créer un compte</a>
        </p>
      </div>
    </div>
  )
}
