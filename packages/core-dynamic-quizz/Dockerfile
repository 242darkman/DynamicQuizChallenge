# Utilise l'image officielle de Node.js 18 comme base
FROM node:18

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie le package.json et package-lock.json
COPY packages/core-dynamic-quizz/package*.json ./

# Installe les dépendances du projet
# hadolint ignore=DL3003
RUN npm install

# Copie le reste des fichiers du projet
COPY packages/core-dynamic-quizz/ .

# Lance l'application
CMD ["npm", "run", "start"]