import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import LandingHomePage from "./pages/LandingHomePage";
import FeaturesPage from "./pages/FeaturesPage";

// temporary placeholders (until teammates finish)
const AboutPage = () => <h2>About Page</h2>;
const HomePage = () => <h2>Dashboard</h2>;
const PlannerPage = () => <h2>Planner</h2>;
const TimerPage = () => <h2>Timer</h2>;
const ProgressPage = () => <h2>Progress</h2>;
const SettingsPage = () => <h2>Settings</h2>;

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingHomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<HomePage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
