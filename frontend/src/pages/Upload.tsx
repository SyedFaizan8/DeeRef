import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert('choose file');
    const fd = new FormData();
    fd.append('file', file);
    const res = await api.post('/pdfs/upload', fd);
    nav('/dashboard');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Upload PDF</h2>
      <form onSubmit={submit} className="space-y-3">
        <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Upload</button>
      </form>
    </div>
  );
}
