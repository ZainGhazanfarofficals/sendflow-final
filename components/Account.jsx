"use client"
import { useState, useEffect } from 'react';
import './account.css'
import { useSession } from 'next-auth/react';

export default function Accounts() {
  const [entries, setEntries] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editId, setEditId] = useState(null);

  const { data:user } = useSession();
  const acc = user?.user?.email;
  console.log("session",acc)

  useEffect(() => {
    fetch(`/api/entries?acc=${acc}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => setEntries(data));
  }, [acc]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editId) {
      // Edit existing entry
      const updatedEntry = await fetch(`/api/entries/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      }).then((res) => res.json());

      setEntries(entries.map(entry => entry._id === editId ? updatedEntry : entry));
      setEditId(null);
    } else {
      // Add new entry
      const newEntry = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, acc }),
      }).then((res) => res.json());

      setEntries([...entries, newEntry]);
    }

    // Clear the form fields
    setEmail('');
    setPassword('');
  };

  const handleEdit = (entry) => {
    setEmail(entry.email);
    setPassword(entry.appPassword);
    setEditId(entry._id);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/entries/${id}`, { method: 'DELETE' });
    setEntries(entries.filter(entry => entry._id !== id));
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} >
        <div className="form-input-group">
          <label htmlFor="email" className="label">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="form-input-group">
          <label htmlFor="password" className="label">App Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
          <a
           className="link"
            target="_blank"  href="https://myaccount.google.com/apppasswords"
          >
            Generate App Password here!
          </a>
        </div>
        <button type="submit"  className="button">
          {editId ? 'Update' : 'Add'}
        </button>
      </form>

      <table className="table">
        <thead className="thead">
          <tr>
            <th className="th-td">Email</th>
            <th className="th-td">Password</th>
            <th className="th-td">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry._id} className="tr">
              <td className="th-td">{entry.email}</td>
              <td className="th-td">{entry.appPassword}</td>
              <td className="th-td">
                <button 
                  onClick={() => handleEdit(entry)} 
                  className="button"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(entry._id)} 
                  className="button button-red"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

