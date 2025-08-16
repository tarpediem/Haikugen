# 🌸 Haikugen - AI-Powered Haiku Generator 俳句

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://hub.docker.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-API-FF6B6B)](https://openrouter.ai/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> *Where technology meets the ancient art of Japanese poetry*

Haikugen is a modern web application that harnesses the power of artificial intelligence to create beautiful, traditional haikus. By combining user-provided keywords and custom themes with advanced AI models through OpenRouter, it generates authentic 5-7-5 syllable haikus that capture moments, emotions, and observations in the timeless Japanese tradition.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Generation**: Leverages OpenRouter API with models like Claude 3 Haiku, GPT-4 Turbo, and Claude 3 Sonnet
- **Traditional Structure**: Strict adherence to the 5-7-5 syllable pattern
- **Custom Themes**: Create and save your own themes - from "Childhood Nostalgia" to "Zombie Apocalypse"
- **Keyword Integration**: Seamlessly incorporates up to 5 user-provided keywords
- **Smart Validation**: Built-in syllable counter ensures perfect haiku structure

### 🎨 User Experience
- **Zen-Inspired Design**: Minimalist Japanese aesthetic with thoughtful use of white space
- **Dark/Light Mode**: Seamlessly switch between themes for comfortable viewing
- **Smooth Animations**: Subtle transitions and fade-in effects
- **Mobile Responsive**: Beautiful experience across all devices
- **Export Options**: Save your haikus as elegant images with aesthetic backgrounds

### 💾 Additional Features
- **Local History**: Automatically saves your generated haikus
- **Regeneration**: One-click to create variations with the same parameters
- **Theme Library**: Access recently used and favorite themes
- **Multi-Theme Mixing**: Combine multiple themes for unique creations
- **Social Sharing**: Easy sharing to social media platforms

## 📸 Demo

<div align="center">
  <img src="docs/images/screenshot-main.png" alt="Haikugen Main Interface" width="600"/>
  <br/>
  <em>Main interface with theme selection and keyword input</em>
</div>

<div align="center">
  <img src="docs/images/screenshot-haiku.png" alt="Generated Haiku Display" width="600"/>
  <br/>
  <em>Beautiful haiku display with export options</em>
</div>

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- OpenRouter API key ([Get one here](https://openrouter.ai/))
- Docker (optional, for containerized deployment)

### 🏠 Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/haikugen.git
   cd haikugen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   NODE_ENV=development
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Visit `http://localhost:5173` to see the application.

### 🐳 Docker Installation

#### Using Docker Compose (Recommended)

1. **Clone and configure**
   ```bash
   git clone https://github.com/yourusername/haikugen.git
   cd haikugen
   cp .env.example .env
   # Add your OpenRouter API key to .env
   ```

2. **Build and run**
   ```bash
   # Production mode
   docker compose up -d
   
   # Development mode with hot reload
   docker compose -f docker-compose.dev.yml up
   ```

3. **Access the application**
   - Production: `http://localhost:8080`
   - Development: `http://localhost:5173`

#### Using Docker directly

```bash
# Build the image
docker build -f docker/Dockerfile -t haikugen:latest .

# Run the container
docker run -d -p 8080:80 --env-file .env haikugen:latest
```

## 📖 Usage Guide

### Creating Your First Haiku

1. **Enter Keywords**: Add up to 5 words that you want to appear in your haiku
2. **Choose or Create a Theme**: 
   - Select from suggestions or type your own custom theme
   - Try unique themes like "Cyberpunk Tokyo" or "Medieval Kitchen"
3. **Generate**: Click the generate button and watch your haiku appear
4. **Refine**: Not satisfied? Click regenerate for a new variation

### Example Haikus

**Theme: "Childhood Nostalgia" + Keywords: "swing", "summer"**
```
Summer swing stands still
Echoes of laughter fade soft
Old tree remembers
```

**Theme: "Digital Age" + Keywords: "screen", "silence"**
```
Screen's gentle blue glow
Silence speaks in pixels bright
Connection fades dark
```

## 🔧 Configuration

### API Setup

1. **Get an OpenRouter API Key**
   - Visit [OpenRouter](https://openrouter.ai/)
   - Sign up for an account
   - Generate an API key from your dashboard

2. **Configure the Application**
   ```typescript
   // src/config/api.ts
   export const API_CONFIG = {
     url: 'https://openrouter.ai/api/v1/chat/completions',
     models: [
       'anthropic/claude-3-haiku',
       'openai/gpt-4-turbo',
       'anthropic/claude-3-sonnet'
     ],
     defaultModel: 'anthropic/claude-3-haiku'
   };
   ```

### Environment Variables

```env
# Required
OPENROUTER_API_KEY=your_api_key_here

# Optional
NODE_ENV=production|development
VITE_APP_TITLE=Haikugen
VITE_API_TIMEOUT=30000
VITE_MAX_RETRIES=3
```

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library with hooks and concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **Zustand** - Lightweight state management

### API & Services
- **OpenRouter API** - Access to multiple AI models
- **Local Storage API** - Client-side data persistence

### DevOps & Deployment
- **Docker** - Containerization
- **Nginx** - Production web server
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
haikugen/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── HaikuForm.tsx       # Main input form
│   │   ├── HaikuDisplay.tsx    # Haiku presentation
│   │   ├── ThemeInput.tsx      # Theme selection/creation
│   │   └── WordInput.tsx       # Keyword input
│   ├── 📂 services/
│   │   └── openrouter.ts       # API integration
│   ├── 📂 hooks/
│   │   ├── useHaikuGenerator.ts
│   │   └── useLocalStorage.ts
│   ├── 📂 utils/
│   │   ├── syllableCounter.ts  # Validation logic
│   │   └── exportUtils.ts      # Image export
│   ├── 📂 types/
│   │   └── haiku.ts            # TypeScript definitions
│   └── 📂 styles/
│       └── globals.css         # Global styles
├── 📂 docker/
│   ├── Dockerfile              # Production build
│   ├── Dockerfile.dev          # Development build
│   └── nginx.conf              # Web server config
├── 📂 public/
│   └── assets/                # Static assets
├── docker-compose.yml          # Production orchestration
├── docker-compose.dev.yml      # Development orchestration
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚢 Deployment

### Option 1: Railway (Recommended for Simplicity)

1. Connect your GitHub repository to Railway
2. Railway auto-detects the Dockerfile
3. Add environment variables in Railway dashboard
4. Deploy with one click

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Option 2: Fly.io

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy
fly auth login
fly launch
fly secrets set OPENROUTER_API_KEY=your_key_here
fly deploy
```

### Option 3: Docker Hub + VPS

```bash
# Build and push
docker build -f docker/Dockerfile -t yourusername/haikugen:latest .
docker push yourusername/haikugen:latest

# On your server
docker pull yourusername/haikugen:latest
docker run -d -p 80:80 --env-file .env yourusername/haikugen:latest
```

### Option 4: Kubernetes

```yaml
# Apply the deployment
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-service.yaml
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript strict mode
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the traditional Japanese art of haiku poetry
- Built with modern web technologies
- Powered by OpenRouter's AI model marketplace
- Special thanks to all contributors

## 📮 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/haikugen/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/haikugen/discussions)
- **Email**: support@haikugen.app

## 🗺 Roadmap

- [ ] PWA support for offline functionality
- [ ] Multi-language support (Japanese, English, French)
- [ ] Batch generation mode
- [ ] Community voting system
- [ ] Social media integration
- [ ] Collaborative haiku creation
- [ ] AI model selection in UI
- [ ] Advanced theme combinations
- [ ] Haiku collections and albums
- [ ] API for third-party integrations

---

<div align="center">
  <p>
    <strong>🌸 Create poetry with the power of AI 🌸</strong>
  </p>
  <p>
    Made with ❤️ and 🍵
  </p>
</div>