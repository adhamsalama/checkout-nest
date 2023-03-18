import { Route, Routes } from "react-router";
import { HTTPMethod, io } from "./api";
import Dashboard from "./components/Dashboard";
import LineChart from "./components/LineChart";
import BarChart from "./components/PieChart";
import Login from "./components/SignIn";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
