# DynamicQuizChallenge ♒

Plateforme de quiz dynamique et personnalisable avec `NestJS 10` et `NextJS 14`, intégrant l'API OpenAI pour une expérience de jeu interactive et enrichissante.

## Description du Projet 📔

Ce projet est une plateforme de quiz qui offre aux utilisateurs une expérience de jeu personnalisée et dynamique. Sélectionnez vos sujets de quiz préférés, ajustez le niveau de difficulté, et plongez dans l'excitation de l'action multijoueur en temps réel. Avec des performances optimales et une sécurité avancée, nous offrons une expérience de quiz sans latence et sans temps d'arrêt.

## Fonctionnalités Essentielles

### Sélection de Sujets

- **Choix de Plusieurs Sujets :** Choisissez parmi une variété de sujets.
- **Niveaux de Difficulté Sélectifs :** Ajustez le niveau de défi selon vos préférences.
- **Option de Mix de Sujets Aléatoires :** Vivez une expérience de quiz variée avec des sujets sélectionnés aléatoirement.

### Intégration de l'API OpenAI

- **Génération de Questions en Temps Réel :** Questions uniques générées à chaque tour.
- **Indices et Explications Contextuels :** Fournit des aides et des explications basées sur l'intelligence d'OpenAI.

### Sessions Multijoueurs en Direct

- **Salles de Jeu Privées/Publiques :** Choix entre rejoindre des salles publiques ou créer des salles privées.
- **Rejoindre un Joueur Instantanément :** Processus de participation fluide et rapide.

### Système de Score

- **Points Basés sur la Précision :** Encourage la précision des réponses.
- **Points Bonus pour la Vitesse :** Récompense les joueurs qui répondent rapidement.

### Tours de Jeu

- **Nombre de Questions Configurable :** Choix du nombre de questions par quiz.
- **Option de Limiter le Nombre de Tours :** Flexibilité pour s'adapter à différentes durées de jeu.

## Bonus Techniques

### Améliorations de Sécurité

- **Authentification JWT :** Gestion sécurisée des sessions utilisateurs.

### Fonctionnalités de Performance

- **Mise en Cache :** Réduit la latence et améliore l'expérience utilisateur.

### Ajouts de Scalabilité

- **Scalabilité Horizontale avec Redis :** Gère les sessions dans un environnement serveur distribué.

---

Le Défi Quiz à Thème Personnalisé Dynamique combine ces fonctionnalités clés avec des bonus techniques pour fournir une expérience de jeu immersive tout en assurant performance, sécurité, et scalabilité.

## Structure initiale du Projet

```bash
.
├── README.md
├── docker-compose.yml
├── package-lock.json
├── package.json
├── packages
│   ├── core-dynamic-quizz
│   │   ├── README.md
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── app.controller.spec.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   ├── auth
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── guards
│   │   │   │   │   └── jwt.guard.ts
│   │   │   │   ├── service
│   │   │   │   │   ├── auth.service.spec.ts
│   │   │   │   │   └── auth.service.ts
│   │   │   │   └── strategy
│   │   │   │       └── jwt.strategy.ts
│   │   │   ├── main.ts
│   │   │   ├── middleware
│   │   │   │   ├── auth
│   │   │   │   │   └── auth.middleware.ts
│   │   │   │   └── logger
│   │   │   │       └── logger.middleware.ts
│   │   │   └── user
│   │   │       ├── controller
│   │   │       │   ├── user.controller.spec.ts
│   │   │       │   └── user.controller.ts
│   │   │       ├── model
│   │   │       │   ├── dto
│   │   │       │   │   ├── create-user.dto.ts
│   │   │       │   │   └── login-user.dto.ts
│   │   │       │   ├── login-response.interface.ts
│   │   │       │   ├── user.entity.ts
│   │   │       │   └── user.interface.ts
│   │   │       ├── service
│   │   │       │   ├── user-helper
│   │   │       │   │   ├── user-helper.service.spec.ts
│   │   │       │   │   └── user-helper.service.ts
│   │   │       │   └── user-service
│   │   │       │       ├── user.service.spec.ts
│   │   │       │       └── user.service.ts
│   │   │       └── user.module.ts
│   │   ├── test
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── tsconfig.build.json
│   │   └── tsconfig.json
│   └── office-dynamic-quizz
│       ├── README.md
│       ├── jsconfig.json
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.js
│       ├── src
│       │   └── app
│       │       ├── favicon.ico
│       │       ├── globals.css
│       │       ├── layout.js
│       │       ├── page.js
│       │       ├── signin
│       │       │   └── page.js
│       │       └── signup
│       │           └── page.js
│       └── tailwind.config.js
```

---

## Installation et Configuration 🚩

Pour mettre en place et exécuter ce projet, suivez ces étapes :

### Solution 1️⃣ :

### Prérequis

- Node.js (version recommandée : 20.x)
- Gestionnaire de paquets `NPM`
- Base de données (MySQL)
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

### Démarrer la base de données

> ### Via docker
>
> Assurez-vous que le port 3306 est libre pour que le container puisse être lancé. Il faudra donc stopper le **XAMPP, WAMP, LAMP ou MAMP**

```bash
docker-compose up -d
```

      > Pour consulter les logs du container

```bash
docker-compose logs -f mysql
```

> ### Si vous utiliser **XAMPP, WAMP, LAMP ou MAMP**
>
> Créer manuellement une base de données au même nom que la variale d'environnement `DB_DATABASE`.

Pour les bases de données `MySQL` ayant ou pas de mot de passe il faudra l'indiquer dans la mettre d'environnement `DB_PASSWORD`.

## Documentation

Pour une compréhension détaillée des composants individuels et de leur fonctionnement, veuillez consulter la documentation dans les dossiers respectifs.

- **Backend (NestJS) :** Documentation disponible dans `core-dynamic-quizz/README.md`.
- **Frontend (NextJS) :** Documentation disponible dans `office-dynamic-quizz/README.md`.

  ### Arrêter les containers en cours d'exécution sans les supprimer

```bash
docker-compose stop
```

### Arrêter et supprimer les containers en cours d'exécution

```bash
docker-compose down
```

## Accéder aux Services via un Navigateur ou un Client API 🌐

Pour une vérification pratique, vous pouvez essayer d'accéder à vos applications via un navigateur ou un client API :

- Pour le **frontend Next.js** 🌐, ouvrez un navigateur et accédez à `http://localhost:3000`.
- Pour le **backend NestJS** 🔧, utilisez un client API comme Postman ou effectuez une requête curl à `http://localhost:5000`.
- Pour l'interface **PHPMyAdmin** ouvrez un navigateur et accédez à `http://localhost:5050`

## Crédit image

Image by <a href="https://www.freepik.com/free-vector/gradient-mountain-landscape_20008474.htm#query=landscape&position=12&from_view=search&track=sph&uuid=9b9ee8a6-ab6d-4a57-a261-097e7af08fa2">Freepik</a>
