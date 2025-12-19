Equipment Monitoring Dashboard

Link: equipment-anomaly-dashboard.vercel.app

Objective: This dashboard is built to visualize and monitor industrial equipment health and safety metrics.

Dataset: The application uses the Industrial Equipment Monitoring Dataset sourced from Kaggle, containing simulated real-time sensor data (temperature, pressure, vibration, humidity) for turbines, compressors, and pumps across multiple locations, along with a binary fault indicator for predictive maintenance and anomaly analysis.

Key Features: 
1.Data Ingestion & Validation
2.Equipment Monitoring & Analysis
3.Interactive Visualizations
4.Data Management
5.Dashboard-ready KPIs and sectioned layouts

Technology Stack:
Frontend-

React 18

TypeScript

Vite 

Recharts 

Data Handling-

PapaParse 

Custom React hooks 

Memoized selectors

Tooling-

ESLint

Setup & Installation:

Prerequisites:

Node.js ≥ 18

npm or yarn

Installation Steps:
# Install dependencies
npm install

# Start development server
npm run dev


The application will be available at:

http://localhost:5173

Build for Production
npm run build
