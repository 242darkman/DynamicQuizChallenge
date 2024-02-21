FROM node:18

WORKDIR /app

# Copiez les fichiers package.json et package-lock.json depuis le contexte de construction vers l'image Docker
COPY package*.json ./

# Installez les dépendances globales
RUN npm install -g @nestjs/cli

# Copiez le reste des fichiers de l'application depuis le contexte de construction vers l'image Docker
COPY . .

# Installez les dépendances de l'application
RUN npm install

EXPOSE  5000

CMD ["npm", "run", "start"]
