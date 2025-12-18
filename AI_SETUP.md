# AI Integration - Setup Guide

## Quick Start

### 1. Get API Key (FREE)
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up (free account)
3. Go to Keys → Create New Key
4. Copy your API key

### 2. Configure Zenith
```bash
# Create .env file
cp .env.example .env

# Edit .env and add your key:
VITE_OPENROUTER_API_KEY=sk-or-YOUR_KEY_HERE
```

### 3. Restart Dev Server
```bash
npm run dev
```

### 4. Test It!
- Press `Ctrl+K` to open AI panel
- Type: "Write a haiku about markdown"
- Press Enter
- Watch the magic! ✨

## Features

### AI Chat Panel
- **Toggle**: `Ctrl+K` or click Sparkles icon
- **Real-time**: Streaming responses word by word
- **History**: Full conversation context

### Slash Commands (In Editor)
- `/improve` - Better grammar & style
- `/summarize` - Quick summary
- `/continue` - Keep writing
- `/fix` - Grammar fixes
- `/shorter` - More concise
- `/longer` - More detailed
- `/casual` - Friendly tone
- `/formal` - Professional tone
- `/technical` - Technical language

## Model Info
- **Model**: `openai/gpt-oss-20b:free`
- **Cost**: FREE (no charges)
- **Speed**: ~2-3 seconds per response
- **Limits**: Generous free tier

## Troubleshooting

**"Failed to send message"**
→ Check your API key in `.env`

**"API key not configured"**
→ Restart dev server after adding key

**No response**
→ Check console for errors

## Privacy Note
- All messages sent to OpenRouter servers
- Model: GPT-OSS (open source)
- No data retention by default

---

**Enjoy AI-powered writing!** 🚀
