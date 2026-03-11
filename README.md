## AI Trust Experimentation Engine: Humanlike AI Systems

### Project Overview
This repository contains a modular, open-source experimentation engine designed to study trust calibration in AI-assisted decision-making. The platform allows researchers to manipulate humanlike vs. authority-signaling interface cues and capture high-resolution behavioral data (decisions and latency) to measure how users rely on or override AI recommendations.

### Tech Stack
- **Frontend:** React.js (Vite)  
- **Backend:** FastAPI (Python)  
- **Instrumentation:** `performance.now()` for millisecond precision  
- **Logging:** Loguru for structured JSON behavioral streams  
- **Icons:** Lucide-React

### Architectural Reasoning & Design Decisions

### Experimental Design (Cues)

The system implements a **High-Contrast Cue Framework** to isolate the effect of *Social Heuristics*:

#### Condition A (Control)
Utilizes **"Machine-as-Tool" cues**.  
By using desaturated colors (`#64748b`), a robotic icon, and monospace-style technical jargon (`SYSTEM_LOGIC_UNIT`, `DATA_OUTPUT`), the interface minimizes perceived agency.

#### Condition B (Experimental)
Utilizes **"Machine-as-Agent" cues**.  
By introducing a human name ("Maya"), a vibrant accent color (`#0ea5e9`), and first-person conversational language ("I've analyzed...", "What do you think?"), the interface triggers social scripts, allowing researchers to measure **Overtrust**.

---

### Data Integrity

#### Precision Timing
`performance.now()` is used instead of `Date.now()` to ensure **sub-millisecond accuracy** in latency measurement, which is vital for distinguishing between **Heuristic (fast)** vs. **Systematic (slow)** decision-making.

#### Schema Validation
The **FastAPI** backend uses **Pydantic models** to enforce strict data types, ensuring the generated **CSV/JSON datasets are analysis-ready** without further cleaning.

### Data Schema

Every user interaction generates a log entry with the following structure:

| Field | Type | Description |
|------|------|-------------|
| `participant_id` | String | Unique UUID for the session |
| `condition` | String | `A` (Robotic / Control) or `B` (Humanlike / Experimental) |
| `decision` | String | `'Accept'` or `'Override'` |
| `latency_ms` | Float | High-precision time elapsed during decision |
| `confidence_rating` | Integer | Post-task user rating (1–5) |
| `timestamp` | ISO8601 | Server-side UTC timestamp of the event |

### Getting 

#### 1. Clone the Repository

Open your terminal and run:

```bash
git clone https://github.com/YOUR_USERNAME/human-ai-trust-experiment.git

cd human-ai-trust-experiment
```

#### 2. Backend Setup (FastAPI)

Navigate to the **backend** folder and set up the Python environment:

```bash
cd backend

python3 -m venv venv

source venv/bin/activate

pip install fastapi uvicorn loguru pydantic

python3 main.py
```

The server will run at **http://localhost:8000**.

#### 3. Frontend Setup (React)

Open a new terminal, navigate to the **frontend** folder, and launch the UI:

```bash
cd frontend
npm install
npm run dev
```
The server will run at **http://localhost:5173**.

### Directory Structure

```plaintext
human-ai-trust-experiment/
├── backend/
│   ├── main.py            # API logic and Pydantic schema
│   ├── venv/              # Python virtual environment
│   └── out/               # Generated behavioral_data.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Experiment logic & Randomization
│   │   └── App.css        # UI/UX & Cue styling
│   └── ...
└── README.md              # Project documentation
```


### Features (Screening Task)

- **Scenario Context:** Users are presented with a high-stakes medical triage scenario to ground the decision-making process.

- **A/B Randomization:** Automated 50/50 split between **Robotic** and **Humanlike** conditions.

- **Behavioral Tracking:** Captures real-time decision outcomes and interaction speed.

- **Stretch Goal:** Implemented a **Post-Task Confidence Rating** to compare attitudinal trust with actual behavioral reliance.