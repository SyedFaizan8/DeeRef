import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await register(email, password);
    nav('/dashboard');
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full p-2 bg-green-600 text-white">Create account</button>
      </form>
    </div>
  );
}
