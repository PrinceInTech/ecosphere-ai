import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Scanner from "./pages/Scanner";
import Assistant from "./pages/Assistant";
import Advisor from "./pages/Advisor";
import Analytics from "./pages/Analytics";
import Impact from "./pages/Impact";
import Knowledge from "./pages/Knowledge";
import ResponsibleAI from "./pages/ResponsibleAI";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/advisor" element={<Advisor />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/responsible-ai" element={<ResponsibleAI />} />
      </Route>
    </Routes>
  );
}
