import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [files, setFiles] = useState<any[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    api.get('/pdfs').then(r => setFiles(r.data)).catch(() => { });
  }, []);

  async function del(uuid: string) {
    if (!confirm('Delete?')) return;
    await api.delete(`/pdfs/${uuid}`);
    setFiles(prev => prev.filter(f => f.uuid !== uuid));
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">My Library</h2>
        <div>
          <Link to="/upload" className="px-3 py-1 bg-blue-600 text-white rounded">Upload</Link>
        </div>
      </div>
      <div className="space-y-2">
        {files.map(f => (
          <div key={f.uuid} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-medium">{f.title || f.filename}</div>
              <div className="text-sm text-slate-500">{new Date(f.createdAt).toLocaleString()}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => nav(`/viewer/${f.uuid}`)} className="px-2 py-1 border rounded">Open</button>
              <button onClick={() => del(f.uuid)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
        {files.length === 0 && <div className="p-6 text-center text-slate-500 bg-white rounded shadow">No PDFs yet.</div>}
      </div>
    </div>
  );
}
