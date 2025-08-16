# Générateur de Haikus avec IA

## Vue d'ensemble du projet
Application web qui génère des haïkus personnalisés en utilisant l'IA via OpenRouter. L'utilisateur fournit des mots-clés et sélectionne un thème, et l'application génère des haïkus respectant la structure traditionnelle 5-7-5 syllabes.

## Objectifs principaux
- Créer une interface utilisateur intuitive pour saisir des mots-clés et choisir des thèmes
- Intégrer l'API OpenRouter pour la génération de haïkus via IA
- Respecter la structure traditionnelle des haïkus (5-7-5 syllabes)
- Permettre la sauvegarde et le partage des haïkus générés

## Stack technique préféré
- **Frontend**: React avec TypeScript (ou Vue.js/Svelte selon préférence)
- **Styling**: Tailwind CSS pour un design zen et minimaliste
- **API**: OpenRouter pour accéder aux modèles d'IA
- **Containerisation**: Docker pour le déploiement
- **Déploiement**: Docker Hub, Kubernetes, ou services compatibles Docker (Railway, Fly.io, etc.)

## Structure du projet
```
haiku-generator/
├── src/
│   ├── components/
│   │   ├── HaikuForm.tsx       # Formulaire pour mots-clés et thèmes
│   │   ├── HaikuDisplay.tsx    # Affichage des haïkus générés
│   │   ├── ThemeInput.tsx      # Saisie libre des thèmes personnalisés
│   │   └── WordInput.tsx       # Saisie des mots-clés
│   ├── services/
│   │   └── openrouter.ts       # Intégration API OpenRouter
│   ├── types/
│   │   └── haiku.ts            # Types TypeScript
│   └── utils/
│       └── syllableCounter.ts  # Validation structure 5-7-5
├── docker/
│   ├── Dockerfile              # Configuration Docker production
│   ├── Dockerfile.dev          # Configuration Docker développement
│   └── nginx.conf              # Configuration Nginx pour servir l'app
├── .dockerignore               # Fichiers à exclure du build Docker
├── docker-compose.yml          # Orchestration Docker
├── docker-compose.dev.yml      # Configuration développement
├── .env                        # Variables d'environnement (API key)
├── .env.example                # Template des variables d'environnement
└── package.json

```

## Fonctionnalités clés

### 1. Génération de haïkus
- **Entrée utilisateur**: 
  - Champ pour saisir jusqu'à 5 mots-clés
  - Champ libre pour définir un ou plusieurs thèmes personnalisés
  - Possibilité de sauvegarder les thèmes favoris
- **Traitement**:
  - Envoi des paramètres à l'API OpenRouter
  - Validation de la structure 5-7-5 syllabes
  - Gestion des erreurs et retry si nécessaire

### 2. Gestion des thèmes
- **Thèmes personnalisés**: L'utilisateur peut créer ses propres thèmes librement
- **Saisie libre**: Champ de texte pour définir n'importe quel thème
- **Suggestions de thèmes** (optionnel, désactivables):
  - Nature, Saisons, Émotions, Urbain, Philosophique
  - Technologie, Cuisine, Voyage, Sport, Art
- **Historique des thèmes**: Sauvegarde des thèmes récemment utilisés
- **Combinaison de thèmes**: Possibilité de mixer plusieurs thèmes

### 3. Fonctionnalités additionnelles
- Historique des haïkus générés (stockage local)
- Bouton de régénération pour obtenir une nouvelle version
- Export en image avec fond esthétique
- Mode sombre/clair
- Animations douces et transitions zen

## Intégration OpenRouter

### Configuration API
```typescript
// Configuration de base pour OpenRouter
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;

// Modèles recommandés pour la génération créative
const RECOMMENDED_MODELS = [
  'anthropic/claude-3-haiku',
  'openai/gpt-4-turbo',
  'anthropic/claude-3-sonnet'
];
```

### Prompt système pour génération
```
Tu es un maître poète spécialisé dans la création de haïkus traditionnels japonais.
Règles strictes:
1. Structure exacte: 5 syllabes (ligne 1), 7 syllabes (ligne 2), 5 syllabes (ligne 3)
2. Incorporer les mots-clés fournis de manière naturelle
3. Respecter le thème choisi
4. Capturer un moment, une émotion ou une observation
5. Utiliser des images concrètes et sensorielles
6. Éviter les rimes
7. Créer une césure ou un tournant surprenant
```

## Considérations UX/UI

### Design minimaliste
- Palette de couleurs inspirée du Japon (blanc, noir, rouge vermillon)
- Typographie élégante (police serif pour les haïkus)
- Espace blanc généreux
- Animations subtiles (apparition en fondu)

### Accessibilité
- Support complet du clavier
- Contraste WCAG AAA
- Lecteurs d'écran compatibles
- Tailles de police ajustables

## Gestion d'état
- Context API React ou Zustand pour état global simple
- État local pour formulaires
- LocalStorage pour persistance des favoris

## Configuration Docker

### Dockerfile Production
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Dockerfile Développement
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### docker-compose.yml
```yaml
services:
  haiku-app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: haiku-generator
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped
    networks:
      - haiku-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  haiku-network:
    driver: bridge
```

### docker-compose.dev.yml
```yaml
services:
  haiku-app-dev:
    build:
      context: .
      dockerfile: docker/Dockerfile.dev
    container_name: haiku-generator-dev
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - ./index.html:/app/index.html
    environment:
      - NODE_ENV=development
    env_file:
      - .env
    stdin_open: true
    tty: true
    networks:
      - haiku-network-dev

networks:
  haiku-network-dev:
    driver: bridge
```

### Configuration Nginx
```nginx
# docker/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

### .dockerignore
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env.example
.vscode
.idea
dist
build
.DS_Store
*.log
docker-compose*.yml
Dockerfile*
```

## Tests recommandés
- Tests unitaires pour le compteur de syllabes
- Tests d'intégration pour l'API OpenRouter
- Tests E2E pour le parcours utilisateur complet
- Tests de performance pour le temps de génération

## Optimisations futures
- PWA pour utilisation hors ligne
- Multilingue (japonais, anglais, français)
- Génération par lots
- Système de votes/favoris communautaire
- Intégration avec réseaux sociaux pour partage
- Mode collaboratif pour création à plusieurs

## Exemples de haïkus attendus

**Thème personnalisé "Nostalgie d'enfance" + Mots: "balançoire", "été"**
```
Balançoire d'été
Les rires se sont envolés
L'arbre se souvient
```

**Thème personnalisé "Apocalypse zombie" + Mots: "silence", "ville"**
```
Silence de ville
Les ombres errent sans but
Plus personne ne court
```

**Thème personnalisé "Cuisine française" + Mots: "beurre", "matin"**
```
Beurre du matin
Croissant doré qui s'effrite
Paris s'éveille
```

## Notes pour le développement
- Prévoir rate limiting côté client
- Cache des générations pour éviter les appels API redondants
- Fallback sur modèles alternatifs si erreur
- Logger les métriques d'utilisation pour amélioration continue

## Commandes utiles
```bash
# Installation locale
npm install

# Développement local
npm run dev

# Build production
npm run build

# Tests
npm test

# Linting
npm run lint

# --- DOCKER COMPOSE V2 ---

# Build image Docker production
docker build -f docker/Dockerfile -t haiku-generator:latest .

# Build image Docker développement
docker build -f docker/Dockerfile.dev -t haiku-generator:dev .

# Lancer avec docker compose (production)
docker compose up -d

# Lancer avec docker compose (développement)
docker compose -f docker-compose.dev.yml up

# Voir les logs
docker compose logs -f haiku-app

# Arrêter les conteneurs
docker compose down

# Rebuild et relancer
docker compose up -d --build

# Nettoyer les images/conteneurs
docker system prune -a

# Push vers Docker Hub
docker tag haiku-generator:latest username/haiku-generator:latest
docker push username/haiku-generator:latest

# Déployer sur un serveur
ssh user@server "docker pull username/haiku-generator:latest && docker run -d -p 80:80 --env-file .env username/haiku-generator:latest"
```

## Déploiement Docker

### Option 1: Docker Hub + VPS
1. Builder l'image : `docker build -f docker/Dockerfile -t username/haiku-generator:latest .`
2. Push sur Docker Hub : `docker push username/haiku-generator:latest`
3. Sur le serveur : `docker pull username/haiku-generator:latest`
4. Lancer : `docker run -d -p 80:80 --env-file .env username/haiku-generator:latest`

### Option 2: Railway.app (recommandé pour simplicité)
1. Connecter le repo GitHub
2. Railway détecte automatiquement le Dockerfile
3. Configurer les variables d'environnement dans Railway
4. Deploy automatique à chaque push

### Option 3: Fly.io
```bash
# Installer flyctl
curl -L https://fly.io/install.sh | sh

# Login et déployer
fly auth login
fly launch
fly deploy
```

### Option 4: Kubernetes (pour scalabilité)
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: haiku-generator
spec:
  replicas: 3
  selector:
    matchLabels:
      app: haiku-generator
  template:
    metadata:
      labels:
        app: haiku-generator
    spec:
      containers:
      - name: haiku-app
        image: username/haiku-generator:latest
        ports:
        - containerPort: 80
        env:
        - name: OPENROUTER_API_KEY
          valueFrom:
            secretKeyRef:
              name: haiku-secrets
              key: api-key
```

## Resources et références
- [Documentation OpenRouter](https://openrouter.ai/docs)
- [Structure traditionnelle des haïkus](https://en.wikipedia.org/wiki/Haiku)
- [Compteur de syllabes en français](https://www.compteur-de-syllabes.com/)
- [Inspiration design japonais](https://www.japan.travel/en/)