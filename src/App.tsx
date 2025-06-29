import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateRoute from "./pages/CreateRoute";
import StudyRoute from "./pages/StudyRoute";
import StudyActivity from "./pages/StudyActivity";
import Notes from "./pages/Notes";
import NotFound from "./pages/NotFound";

const App = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/create-route" element={<CreateRoute />} />
    <Route path="/study-route/:id" element={<StudyRoute />} />
    <Route path="/study-activity/:routeId/:activityId" element={<StudyActivity />} />
    <Route path="/notes" element={<Notes />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
