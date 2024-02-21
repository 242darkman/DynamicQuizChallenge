FROM node:18 AS development

WORKDIR /usr/src/app

# Copiez les fichiers package.json et package-lock.json depuis le contexte de construction vers l'image Docker
COPY package*.json ./

# Installez les dépendances de l'application
RUN npm install

# Copiez le reste des fichiers de l'application depuis le contexte de construction vers l'image Docker
COPY . .

EXPOSE  3000

CMD ["npm", "run", "dev"]
