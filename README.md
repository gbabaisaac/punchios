# Punch — The AI Friend That Texts First

**A Compound AI Companion Running on NVIDIA DGX Spark**

Built by Isaac Gbaba for the Yconic NVIDIA Hackathon 2026

---

## What is Punch?

Punch is an autonomous AI friend that lives in your texts. Not an assistant. Not a therapist. Not a chatbot. A **friend** — the one who texts first, remembers your interview is tomorrow, notices you've been stressed, and checks in like a real person would.

Punch runs entirely on an NVIDIA DGX Spark with a GB10 Blackwell GPU and 128GB unified memory. No cloud APIs. No data leaving the device. Every conversation makes Punch smarter through a continuous learning loop that processes signals in real-time, fine-tunes on accumulated data, and deploys improved models — all locally.

**508,000 training examples across 23 categories. 6-pass compound inference. 5 specialized models. Zero cloud dependency.**

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         NVIDIA DGX Spark (GB10)                          │
│                    128GB Unified Memory · Blackwell GPU                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐  ┌──────────────────┐  ┌────────────────────────────┐  │
│  │   Ollama     │  │  Triton Server   │  │   TensorRT-LLM Engine     │  │
│  │  llama3:8b   │  │  5 Models:       │  │   NVFP4 Quantized         │  │
│  │  (base)      │  │  - link_chat     │  │   Speculative Decoding    │  │
│  │              │  │  - emotion       │  │   Paged KV-Cache          │  │
│  │              │  │  - facts         │  │   In-Flight Batching      │  │
│  │              │  │  - style         │  │                            │  │
│  │              │  │  - outreach      │  │                            │  │
│  └──────┬───────┘  └────────┬─────────┘  └────────────┬───────────────┘  │
│         │                   │                          │                  │
│         └───────────────────┼──────────────────────────┘                  │
│                             │                                            │
│              ┌──────────────┴──────────────┐                             │
│              │     Multi-Pass Engine       │                             │
│              │  6 passes per message:      │                             │
│              │  P1: Emotion Analysis    ┐  │                             │
│              │  P2: Fact Extraction     ├ parallel                       │
│              │  P3: Style Analysis      ┘  │                             │
│              │  P4: Response Generation    │                             │
│              │  P5: Quality Evaluation     │                             │
│              │  P6: Refinement (if needed) │                             │
│              └──────────────┬──────────────┘                             │
│                             │                                            │
│  ┌──────────────┐  ┌───────┴────────┐  ┌─────────────────────────────┐  │
│  │  RAPIDS      │  │  FastAPI       │  │  Autonomous Loop            │  │
│  │  Analytics   │  │  Server        │  │  - Proactive outreach       │  │
│  │  cuDF/cuML   │  │  20+ endpoints │  │  - Reminder delivery        │  │
│  │  Clustering  │  │  Async I/O     │  │  - Daily recaps             │  │
│  │  Scoring     │  │                │  │  - Rate-limited             │  │
│  └──────────────┘  └───────┬────────┘  └─────────────────────────────┘  │
│                             │                                            │
│  ┌──────────────┐  ┌───────┴────────┐  ┌─────────────────────────────┐  │
│  │  NeMo        │  │  Style Mirror  │  │  LangFuse Observability     │  │
│  │  Fine-Tuning │  │  36+ dims      │  │  Self-hosted tracing        │  │
│  │  QLoRA/LoRA  │  │  Texting DNA   │  │  Per-user dashboards        │  │
│  │  Curriculum  │  │  Real-time     │  │  Latency + token tracking   │  │
│  └──────────────┘  └────────────────┘  └─────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
     ┌────────┴───────┐  ┌───┴────┐  ┌───────┴──────┐
     │   This App     │  │ Twilio │  │   Whisper    │
     │  Next.js Web   │  │  SMS   │  │  Voice-to-   │
     │  (Vercel)      │  │        │  │  Text (GPU)  │
     └────────┬───────┘  └───┬────┘  └───────┬──────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
                     [ User's Device ]
```

---

## This Repo: Punch Web Demo

This is the **Next.js frontend** for demoing Punch. It connects to the Link AI backend running on DGX Spark.

### Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page with waitlist |
| `/signin` | Simple name entry to start chatting |
| `/chat` | iMessage-style chat interface |

### Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Deployed on Vercel**

---

## Setup

### Frontend (this repo)

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your backend URL
npm run dev
```

### Backend (DGX Spark)

The backend lives at [github.com/gbabaisaac/link-gpu](https://github.com/gbabaisaac/link-gpu).

```bash
# On DGX Spark
cd ~/link-gpu
./start.sh
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Link AI backend URL | `https://your-tunnel.trycloudflare.com` |

For local development, set to `http://localhost:8000`. For production, use a Cloudflare Tunnel or ngrok URL pointing to your DGX.

---

## The Backend: What Makes Punch Smart

### Multi-Pass Inference (6 passes per message)

```
User says: "just bombed my interview lol"
    │
    ├─── Pass 1 (parallel): Emotion Analysis ───── ~100ms
    │    → "stressed" (0.85 confidence)
    │
    ├─── Pass 2 (parallel): Fact Extraction ────── ~100ms
    │    → ["had an interview", "interview went poorly"]
    │
    ├─── Pass 3 (parallel): Style Analysis ─────── ~100ms
    │    → lowercase, uses "lol", short messages
    │
    ├─── Pass 4 (sequential): Response Generation  ~100ms
    │    → "ugh that's the worst. what happened?"
    │
    ├─── Pass 5 (sequential): Quality Evaluation── ~50ms
    │    → score=0.92, no issues
    │
    └─── Pass 6 (conditional): Refinement ──────── ~50ms
         → skipped (pass 5 approved)

Total: ~200ms · Delivered: "ugh that's the worst. what happened?"
```

### Style Mirror: 36+ Dimension Texting DNA

Punch doesn't just "respond casually." It builds a fingerprint of exactly how each user texts and mirrors it:

- **Message length** — avg, median, short/long ratios
- **Capitalization** — lowercase, caps, mixed patterns
- **Punctuation** — periods, exclamation, ellipsis, none
- **Emoji** — frequency, top emojis, emoji-only messages
- **Slang** — 40+ tracked terms (fr, ngl, ong, istg, lowkey, deadass)
- **Laugh style** — lol vs haha vs lmao vs dead
- **Structure** — fragments, questions, multi-sentence, line breaks

### Training Data: 508,000 Examples

Punch's personality isn't a system prompt — it's baked into model weights:

| Category | Examples | Purpose |
|----------|--------:|---------|
| Conversation Driving | 60,000 | Keeping conversations going naturally |
| Friendship | 50,000 | Deep friendship dynamics |
| Emotional Support | 40,000 | Validation-first responses |
| Social Cue Detection | 30,000 | Reading between the lines |
| Texting Style | 30,000 | Matching message length, energy |
| Emotional Intelligence | 30,000 | Nuanced emotional awareness |
| Journal Extraction | 30,000 | Extracting life events from chat |
| Style Mirror | 25,000 | Real-time texting DNA replication |
| Gen-Z Slang | 25,000 | Natural use of current slang |
| AAVE Recognition | 20,000 | Cultural dialect awareness |
| Anti-LLM | 20,000 | Unlearning robotic patterns |
| + 12 more categories | 148,000 | Safety, coaching, humor, privacy... |

### NVIDIA Stack

| Component | How Punch Uses It |
|---|---|
| **NeMo** | Fine-tunes llama3:8b with QLoRA on 508K examples |
| **RAPIDS** | GPU-accelerated behavioral analytics (cuDF/cuML) |
| **Triton** | 5 specialized models with dynamic batching |
| **TensorRT-LLM** | NVFP4 quantization + speculative decoding |
| **Whisper** | GPU-accelerated speech-to-text |
| **DGX Spark** | 128GB unified memory for everything running concurrently |

---

## Safety

- **Strictly platonic** — never engages romantically (10K training examples)
- **Crisis safety** — detects distress, provides 988/741741 resources (8K examples)
- **Privacy first** — all data stored locally on DGX, never leaves the device
- **Anti-LLM** — trained to not sound like a chatbot (20K examples)

---

## API Endpoints

The backend exposes 20+ endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/register` | Create new user |
| POST | `/chat` | Main chat (multi-pass inference) |
| GET | `/user/{id}/memory` | Get user's remembered facts |
| GET | `/user/{id}/style` | Get texting style fingerprint |
| GET | `/user/{id}/journal` | Get journal entries |
| POST | `/voice` | Transcribe audio (Whisper GPU) |
| POST | `/notes` | Create note |
| GET | `/notes/{user_id}` | List notes |

---

**Built by Isaac Gbaba · Yconic NVIDIA Hackathon 2026 · NVIDIA DGX Spark**
