# LeiaoAI - AI-Powered Story & Investment Platform

> 🚀 A comprehensive platform combining AI-driven social storytelling with professional investment consulting services.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live Site**: [leiao.ai](https://leiao.ai)

---

## ✨ Key Features

### 🤖 Multi-AI Chat System
- **3 LLM Models**: OpenAI GPT-4o, Qwen Turbo, DeepSeek
- **Smart Model Selection**: Geo-location based recommendations
- **Response Time Tracking**: Real-time performance monitoring
- **Rich Markdown**: Code highlighting, math formulas (KaTeX)

### 🔐 Multi-Authentication
- Email/Password
- Google OAuth
- Ethereum Wallet (MetaMask)
- Solana Wallet (Phantom)

### 📖 Social Storytelling
- AI-powered story generation
- Community interactions (like, save, comment, share)
- Public/Private user profiles
- Story tagging system

### 💼 Professional Services
- **12 Expertise Areas**: CVC, M&A, IPO (A/HK/US), etc.
- Business Plan analysis with AI insights
- BMC (Business Model Canvas) generator
- Document OCR and analysis

### 🌐 Internationalization
- 13 languages supported
- RTL support for Arabic
- Dynamic language switching

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- At least one AI API key (OpenAI, DeepSeek, or Qwen)

### Installation

```bash
# Clone and install
git clone <repository-url>
cd leiaoai-story-platform
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development
npm run dev
```

### Environment Variables

```env
# Required
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# At least one AI API (required for chat)
VITE_OPENAI_API_KEY=your_openai_key
VITE_DEEPSEEK_API_KEY=your_deepseek_key
VITE_QWEN_API_KEY=your_qwen_key

# Optional
CLOUDCONVERT_API_KEY=your_cloudconvert_key  # For PDF conversion
```

---

## 📦 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Setup

Run these SQL scripts in Supabase SQL Editor:

```bash
# 1. Chat Sessions (required for AI Chat)
docs/setup/chat-sessions-setup.sql

# 2. Wallet Authentication (required for Web3 login)
docs/setup/wallet-auth-setup.sql

# 3. RLS Policies (required for data security)
docs/setup/rls-policies-setup.sql
```

### Verification

Run the verification script to ensure everything is configured:

```sql
-- In Supabase SQL Editor
-- Copy and run: VERIFY-ALL-FEATURES.sql
```

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI, DeepSeek, Qwen APIs
- **Blockchain**: Web3.js (MetaMask, Phantom)
- **i18n**: i18next (13 languages)
- **Animations**: Framer Motion

---

## 📚 Documentation

### Setup Guides
- [Domain Configuration](docs/setup/domain-configuration.md)
- [Wallet Authentication](docs/setup/wallet-auth-setup.md)
- [Chat Sessions](docs/setup/chat-sessions-setup.md)
- [Supabase Keys](docs/setup/supabase-keys.md)

### User Guides
- [Authentication System](docs/guides/authentication.md)
- [Chat Sessions](docs/guides/chat-sessions.md)
- [BP Analysis](docs/guides/bp-analysis.md)

### Project Info
- [Project Status](docs/PROJECT-STATUS.md) - Current progress (40%)
- [Documentation Structure](docs/DOCUMENTATION-STRUCTURE.md)

---

## 📁 Project Structure

```
leiaoai-story-platform/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # Global state (Auth, Theme, AI)
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page components
│   └── lib/             # Utilities & configs
├── api/                 # Vercel Serverless Functions
├── docs/                # Documentation
│   ├── setup/          # Setup guides
│   ├── guides/         # Usage guides
│   └── archive/        # Archived docs
├── public/
│   └── locales/        # Translation files
└── VERIFY-ALL-FEATURES.sql  # Database verification
```

---

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🔒 Security Notes

- ⚠️ Never commit `.env.local` or API keys
- 🔐 Use environment variables in Vercel for production
- 🛡️ RLS policies protect all database tables
- 🔑 Web3 wallets use signature verification

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact

- **Website**: [leiao.ai](https://leiao.ai)
- **Email**: support@leiao.ai
- **Offices**: Shenzhen, Hong Kong, San Jose

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🎯 Roadmap

- [x] Multi-authentication (Email, Google, Web3)
- [x] AI Chat with 3 LLM models
- [x] BP Analysis with OCR
- [x] BMC Generator
- [ ] About/Privacy/Terms pages (In Progress)
- [ ] Enhanced BP multi-source analysis
- [ ] Mobile app (React Native)

---

**Status**: 🚧 Active Development  
**Version**: 2.0.0  
**Last Updated**: January 2025

Made with ❤️ by LeiaoAI Team
