import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ModelPage from "./pages/ModelPage";
import ModelEvaluationPage from "./pages/ModelEvaluationPage";
import HistoryPage from "./pages/HistoryPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="model" element={<ModelPage />} />
                <Route path="model-evaluation" element={<ModelEvaluationPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}
