import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RouteScrollManager from './components/RouteScrollManager';
import Home from './pages/Home';
import NotFoundPage from './pages/NotFoundPage';
import ProjectDetail from './pages/ProjectDetail';

export default function App() {
  return (
    <div className="min-h-dvh">
      <RouteScrollManager />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
