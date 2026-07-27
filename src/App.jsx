import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';

export default function App() {
  return (
    <div className="min-h-dvh">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route
          path="*"
          element={
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted">
              Not found. Go <a href="/">home</a>.
            </div>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}
