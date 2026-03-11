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
### Accessing Research Data
The experiment captures all behavioral metrics in two ways:
1. **Live Feed:** View structured JSON logs in the backend terminal as they happen.
2. **Persistent Storage:** All data is saved to `backend/out/behavioral_data.json`. 

This file uses a single-line JSON format (JSONL-style), making it natively compatible with data science tools like **Python Pandas** or **R** for downstream statistical analysis.

### Features (Screening Task)

- **Scenario Context:** Users are presented with a high-stakes medical triage scenario to ground the decision-making process.

- **A/B Randomization:** Automated 50/50 split between **Robotic** and **Humanlike** conditions.

- **Behavioral Tracking:** Captures real-time decision outcomes and interaction speed.

- **Stretch Goal:** Implemented a **Post-Task Confidence Rating** to compare attitudinal trust with actual behavioral reliance.

### Preliminary Test Results (Internal Audit)

To verify the system’s functionality, a small pilot test was conducted with **N = 15 trials**. The results confirm that the randomization logic operates correctly and that the logging pipeline reliably captures behavioral metrics and timestamps.

#### 1. Randomization Distribution

The automated 50/50 condition assignment behaved within expected bounds for a small sample:

- **Experimental (Humanlike):** 9 trials (60%)  
- **Control (Robotic):** 6 trials (40%)

Given the limited sample size, this distribution is consistent with a randomized split.

#### 2. Behavioral Metrics Analysis

**Acceptance Rates**

Participants accepted the AI recommendation in **60% of the trials** overall. Within the **Experimental (Humanlike)** condition, decision latency showed noticeable variation, ranging from **1,576 ms** to **15,399 ms**, indicating both rapid and deliberative responses.

**Confidence Calibration**

The system successfully captured the post-decision confidence ratings. Responses covered the full **1–5 scale**, with a **mean confidence rating of 3.13**, confirming that the multi-step submission flow (decision → rating → logging) functions correctly.

#### 3. System Integrity

**Latency Precision**

Response latency was recorded using `performance.now()`, capturing fine-grained timing differences (e.g., **1683.1 ms vs. 1920.8 ms**), demonstrating high-resolution timing instrumentation.

**Data Validation**

All **15 entries (100%)** were successfully validated using the **Pydantic schema** and serialized into the `behavioral_data.json` log file without data loss or formatting errors.