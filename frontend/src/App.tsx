import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Viewer from './pages/Viewer';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow p-4 flex justify-between">
        <Link to="/" className="font-bold">PDF Annotator</Link>
        <div className="space-x-2">
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </nav>
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/viewer/:uuid" element={<Viewer />} />
        </Routes>
      </main>
    </div>
  );
}
