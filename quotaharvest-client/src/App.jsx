import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [queue, setQueue] = useState([]);
  const [network, setNetwork] = useState({ usedMB: 0, remainingMB: 0, dailyLimitMB: 1500 });
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Study');

  const fetchData = async () => {
    try {
      const queueRes = await axios.get('http://localhost:5000/api/queue');
      const netRes = await axios.get('http://localhost:5000/api/network-status');
      setQueue(queueRes.data);
      setNetwork(netRes.data);
    } catch (err) {
      console.error('Error fetching data from server:', err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToQueue = async (e) => {
    e.preventDefault();
    if (!url) return;
    try {
      await axios.post('http://localhost:5000/api/queue', { url, title, category });
      setUrl('');
      setTitle('');
      fetchData();
    } catch (err) {
      console.error('Error adding item to queue:', err.message);
    }
  };

  // --- DELETE FUNCTION ---
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/queue/${id}`);
      fetchData(); // Refresh the list immediately after deleting
    } catch (err) {
      console.error('Error deleting item:', err.message);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: 'system-ui, sans-serif', padding: '20px' }}>
      <h1>QuotaHarvest</h1>
      <p style={{ color: '#666' }}>Autonomous Bandwidth Harvesting Agent</p>

      {/* Network Status Card */}
      <div style={{ background: '#f4f6f8', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3>Daily Quota Overview</h3>
        <p>Total Limit: <strong>{network.dailyLimitMB} MB</strong></p>
        <p>Used So Far: <strong>{network.usedMB} MB</strong></p>
        <p style={{ color: '#0070f3' }}>
          Expiring Quota to Harvest: <strong>{network.remainingMB} MB</strong>
        </p>
        <small style={{ color: '#888' }}>Scheduled midnight run: 11:30 PM daily</small>
      </div>

      {/* Form */}
      <form onSubmit={handleAddToQueue} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          placeholder="File Title (e.g. Operating Systems Notes)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="url"
          placeholder="Direct Download URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="Study">Study Material</option>
          <option value="Media">Media / Video</option>
          <option value="Other">Other Asset</option>
        </select>
        <button
          type="submit"
          style={{ padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Add to Midnight Queue
        </button>
      </form>

      {/* Queue List */}
      <h3 style={{ marginTop: '32px' }}>Download Queue</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {queue.length === 0 ? (
          <li style={{ color: '#888' }}>No items in queue. Add one above!</li>
        ) : (
          queue.map((item) => (
            <li
              key={item._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderBottom: '1px solid #eee'
              }}
            >
              <div>
                <strong>{item.title}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>{item.category} • {item.url}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span
                  style={{
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: item.status === 'downloaded' ? '#2e7d32' : item.status === 'failed' ? '#d32f2f' : '#ed6c02'
                  }}
                >
                  {item.status.toUpperCase()}
                </span>
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{
                    padding: '6px 10px',
                    background: '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}