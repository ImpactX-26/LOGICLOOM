
# 🌋 VOLCANO ZERO
### Agentic AI for Volcanic Investigation, Risk Assessment & Emergency Response

VOLCANO ZERO is an AI-powered volcanic monitoring and emergency-response prototype developed for **ImpactX'26** by team **LOGICLOOM**.

The project combines a 3D volcanic island simulation, multi-agent investigation workflows, sensor telemetry, drone missions, risk assessment, and evacuation-support concepts in an interactive command-center interface.

It also includes a dedicated **AI Verification Center** that evaluates Agentic AI predictions against historical Merapi CSV observations and displays prediction comparisons and backtesting statistics.

> **Project status:** Hackathon prototype. The current monitoring scenario and sensor telemetry are simulated. Historical CSV backtesting is available for demonstration and evaluation; it does not establish real-world eruption forecasting accuracy.

---

## ✨ Key Features

### 1. Interactive Volcano Command Center
- Dashboard for monitoring volcanic activity.
- Interactive 3D volcanic island environment.
- Sensor telemetry and monitoring indicators.
- Event timeline and investigation status.
- Risk-zone visualization and situational awareness.

### 2. Agentic AI Investigation
- Simulated agentic workflow for volcanic investigation.
- Multi-sensor evidence analysis.
- Hypothesis generation and cross-verification.
- Risk assessment and investigation updates.
- Coordinated scenario execution through a shared application state.

### 3. Drone Missions and Monitoring
- Visualized drone movement and investigation routes.
- Mission status and telemetry displays.
- Evidence collection and monitoring workflow.
- Environmental and hazard information for situational awareness.

### 4. AI Verification Center
A dedicated page for historical backtesting and ground-truth comparison.

The verification workflow is:

**Historical Sensor Data → Agentic AI Evaluation → Predicted Outcome → Historical Ground Truth → Verification → Accuracy Summary**

The page includes:
- Historical Merapi dataset information.
- Sensor observations displayed in a table.
- Agentic AI prediction versus actual historical outcome.
- Correct and incorrect prediction indicators.
- Dynamically calculated backtesting statistics.
- A selectable historical event inspector.
- An option to inspect the raw CSV dataset.
- A control to run historical verification.

Open the page using the **AI Verification** navigation item or the application's supported verification route.

### 5. Historical Merapi Datasets

The project contains two CSV files:

| File | Purpose |
|---|---|
| `data/merapi_backtest_demo.csv` | Original/reference dataset |
| `data/merapi_backtest_demo_corrected.csv` | Primary dataset for the verification demonstration |

The datasets contain volcanic sensor observations, timestamps, and historical outcome labels.

The corrected dataset includes additional timestamp and ground-truth description fields.

The historical `actual_eruption` label is kept separate from the AI prediction. A prediction must be compared with the actual label to determine whether it is correct.

**Important:** These CSV files are demonstration/backtesting data, not a live sensor feed. The presence of historical labels does not by itself establish that the sensor measurements represent a complete, independently validated scientific dataset.

### 6. User Interface
- Dark command-center visual design.
- Responsive monitoring panels and data tables.
- Interactive navigation.
- Visual status indicators.
- Three.js-powered 3D scene.

---

## 🧠 How AI Verification Works

The historical verification process follows these steps:

1. Load the selected CSV dataset.
2. Parse the historical sensor observations.
3. Evaluate the sensor features using the project's implemented prediction logic.
4. Obtain the AI-predicted outcome.
5. Compare the prediction with `actual_eruption`.
6. Mark the result as correct or incorrect.
7. Calculate the overall accuracy from the evaluated records.

### Prediction Evaluation

For binary eruption prediction:

- `1` = Eruption
- `0` = No eruption

A prediction is correct when:

`AI prediction === actual_eruption`

Accuracy is calculated as:

`Accuracy = (Correct Predictions / Total Evaluated Predictions) × 100`

Only records with valid predictions and usable ground-truth labels should be included in the evaluation.

The verification page must not assume that a prediction is correct simply because the historical outcome is known. The predicted and actual outcomes must remain separate.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development server and build tool |
| JavaScript | Application logic |
| Three.js | 3D volcanic environment |
| HTML and CSS | Interface structure and styling |
| CSV | Historical backtesting datasets |
| ESLint | Code quality checks |
| Supabase client | Dependency included for potential backend integration |

The presence of the Supabase client dependency does not mean that a production backend, database, or authentication provider is configured.

---

## 📁 Project Structure

```text
LOGICLOOM/
├── data/
│   ├── merapi_backtest_demo.csv
│   └── merapi_backtest_demo_corrected.csv
├── public/
│   ├── favicon.svg
│   └── volcano-island.jpg
├── src/
│   ├── app/
│   │   └── router.js
│   ├── core/
│   │   ├── auth.js
│   │   ├── backtest.js
│   │   ├── data.js
│   │   ├── sim.js
│   │   ├── volcanoData.js
│   │   └── world.js
│   ├── pages/
│   │   └── views.js
│   ├── scene/
│   │   ├── authScene.js
│   │   ├── realMap.js
│   │   └── volcanoScene.js
│   ├── styles/
│   │   └── main.css
│   ├── ui/
│   │   └── panels.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A modern web browser

### 1. Download or clone the repository

```bash
git clone https://github.com/ImpactX-26/LOGICLOOM.git
cd LOGICLOOM
```

Alternatively, download the repository ZIP and extract it locally.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

`http://localhost:5173`

### 4. Build the project

```bash
npm run build
```

### 5. Run lint checks

```bash
npm run lint
```

---

## 🎬 Demonstration Guide

### Main Volcano Dashboard

1. Launch VOLCANO ZERO.
2. Open the dashboard.
3. Start the volcano scenario.
4. Observe the simulated sensor readings, agent activity, event timeline, risk zones, and drone monitoring.

### AI Verification Center

1. Open **AI Verification** from the navigation menu.
2. Confirm that the Merapi historical dataset loads.
3. Select the corrected dataset for the main demonstration.
4. Click **Run Historical Verification**.
5. Inspect the sensor records and select an individual event.
6. Compare the Agentic AI prediction with the historical actual outcome.
7. Review the correct/incorrect results and dynamically calculated accuracy.
8. Open the raw CSV view if judges want to inspect the underlying data.

The displayed accuracy should reflect the actual evaluated predictions, not a manually entered success rate.

---

## ⚠️ Limitations and Future Improvements

VOLCANO ZERO is a hackathon prototype and should not be used as a real-world volcanic early-warning system.

Current limitations include:
- The main volcanic monitoring scenario uses simulated sensor data.
- The application does not establish a live connection to official volcano-monitoring stations.
- The historical Merapi CSV is a small demonstration dataset and is insufficient for scientifically validating eruption forecasts.
- Backtesting results depend on the implemented prediction logic and the quality of the supplied dataset.
- Authentication and external sign-in require further backend/provider integration.
- Real-world deployment would require validated sensor feeds, scientifically evaluated models, reliable alert delivery, and expert oversight.

### Future Scope

- Integrate authorized real-time seismic, gas, thermal, and deformation data.
- Evaluate predictive models on larger, independently validated historical datasets.
- Add confidence calibration and false-positive/false-negative analysis.
- Integrate reliable notification services for emergency communication.
- Improve geospatial hazard mapping and evacuation-route planning.
- Add secure user authentication, backend storage, and audit logs.

---

## 🏆 Hackathon Project

**Event:** ImpactX'26  
**Team:** LOGICLOOM  
**Project:** VOLCANO ZERO  
**Theme:** Agentic AI

VOLCANO ZERO explores how agentic workflows, interactive visualization, historical data evaluation, and emergency-response planning can work together to support volcanic-hazard investigation.

---

## 📄 License

No specific open-source license is declared in this README. Check the repository's licensing requirements before reusing or redistributing the project.
