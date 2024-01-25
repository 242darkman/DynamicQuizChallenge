# DynamicQuizChallenge ♒
Plateforme de quiz dynamique et personnalisable avec `NestJS 10` et `NextJS 14`, intégrant l'API OpenAI pour une expérience de jeu interactive et enrichissante.


## Description du Projet 📔

Ce projet est une plateforme de quiz qui offre aux utilisateurs une expérience de jeu personnalisée et dynamique. Sélectionnez vos sujets de quiz préférés, ajustez le niveau de difficulté, et plongez dans l'excitation de l'action multijoueur en temps réel. Avec des performances optimales et une sécurité avancée, nous offrons une expérience de quiz sans latence et sans temps d'arrêt.
## Bonus Techniques

### Améliorations de Sécurité
- **Authentification JWT :** Gestion sécurisée des sessions utilisateurs.
## Installation et Configuration 🚩

Pour mettre en place et exécuter ce projet, suivez ces étapes :

### Solution 1️⃣ :

### Prérequis
- Node.js (version recommandée : 20.x)
- Gestionnaire de paquets `NPM`
- Base de données (MongoDB)
- Redis pour la gestion des sessions et la scalabilité

### Installation
1. **Cloner le dépôt :** Utilisez `git clone https://github.com/242darkman/DynamicQuizChallenge.git` pour cloner le projet sur votre machine locale.
2. **Installation des Dépendances :**
   - Accédez à chaque sous-dossier (`core-dynamic-quizz` et `office-dynamic-quizz`) et exécutez `npm install` pour installer les dépendances.

### Configuration de l'Environnement
- **Fichiers `.env` :** Créez des fichiers `.env` dans les sous-dossiers pour configurer les variables d'environnement nécessaires (par exemple, les détails de la base de données, les clés API).

### Démarrage du Serveur
- **Backend (NestJS) :** Dans le dossier `core-dynamic-quizz`, exécutez `npm run start:dev` pour démarrer le serveur backend.
- **Frontend (NextJS) :** Dans le dossier `office-dynamic-quizz`, exécutez `npm run dev` pour lancer le serveur de développement frontend.

## Documentation

Pour une compréhension détaillée des composants individuels et de leur fonctionnement, veuillez consulter la documentation dans les dossiers respectifs.

- **Backend (NestJS) :** Documentation disponible dans `core-dynamic-quizz/README.md`.
- **Frontend (NextJS) :** Documentation disponible dans `office-dynamic-quizz/README.md`.

### Solution 2️⃣ (Utilisation de docker) : 
Cette solution est mise en place afin de travailler avec le même environnement ainsi que les mêmes versions de dépendances des librairies utilisés dans les différents projets.
   ### exécuter le containeurs
```bash
docker-compose up --build -d
```

   ### vérifier l'état des services définis dans le `docker-compose.yml`
```bash
docker-compose ps
```

   ### Consulter les logs
   * Pour le backend ➡️
```bash
docker-compose logs core-dynamic-quizz -f
```
   * Pour le frontend ➡️
```bash
docker-compose logs office-dynamic-quizz -f
```

   ### Arrêter les containers en cours d'exécution sans les supprimer
```bash
docker-compose stop
```

   ### Arrêter et supprimer les containers en cours d'exécution
```bash
docker-compose down
```

---


## Accéder aux Services via un Navigateur ou un Client API 🌐
  Pour une vérification pratique, vous pouvez essayer d'accéder à vos applications via un navigateur ou un client API :

- Pour le **frontend Next.js** 🌐, ouvrez un navigateur et accédez à `http://localhost:3000`.
- Pour le **backend NestJS** 🔧, utilisez un client API comme Postman ou effectuez une requête curl à `http://localhost:5000`.
