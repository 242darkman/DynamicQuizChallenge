'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // router.push('/signup');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-7 bg-white/30 backdrop-blur-sm rounded shadow-lg w-1/2 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-gray-800">Inscription</h2>
        <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom d&#39;utilisateur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmez le mot de passe <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-1/2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:ring focus:ring-blue-300"
            >
              S&#39;inscrire
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-gray-800">
          Vous avez déjà un compte ? <a href="/login" className="text-blue-500 hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  )
}
