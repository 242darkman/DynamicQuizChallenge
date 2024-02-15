# Utilise l'image officielle de Node.js 18 comme base
FROM node:18

# Définit le répertoire de travail dans le conteneur
WORKDIR /app

# Copie le package.json et package-lock.json
COPY packages/office-dynamic-quizz/package*.json ./

# Installe les dépendances du projet
RUN npm install

# Copie le reste des fichiers du projet
COPY packages/office-dynamic-quizz/ .

# Construit l'application pour la production
# hadolint ignore=DL3003
RUN npm run build

# Lance l'application
CMD ["npm", "run", "start"]
