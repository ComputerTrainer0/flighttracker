import React, { useState } from 'react';
import './App.css';

function App() {
  const [flight, setFlight] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('today');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(
        `/prod/departure?flight=${flight}&location=${encodeURIComponent(location)}&date=${date}`
      );
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>🛫 AI Flight Departure Tracker</h1>

      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginBottom: '30px' }}>
        <input
          type="text"
          value={flight}
          onChange={(e) => setFlight(e.target.value)}
          placeholder="Enter Flight Number (e.g., BA198)"
          required
          style={{ margin: '10px', padding: '10px' }}
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter Your Starting Location"
          required
          style={{ margin: '10px', padding: '10px' }}
        />
        <select value={date} onChange={(e) => setDate(e.target.value)} style={{ margin: '10px', padding: '10px' }}>
          <option value="yesterday">Yesterday</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
        </select>
        <button type="submit" style={{ padding: '10px 20px' }}>
          Track Departure
        </button>
      </form>

      {loading && <p style={{ textAlign: 'center' }}>Fetching flight info...</p>}

      {result && !result.error && (
        <div className="result-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <table className="result-table" style={{ borderCollapse: 'collapse', width: '90%', maxWidth: '800px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr>
                <th>Flight Number</th>
                <th>Flight Date</th>
                <th>Status</th>
                <th>Flight From</th>
                <th>Flight To</th>
                <th>Scheduled</th>
                <th>Estimated</th>
                <th>Actual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{result.flight_number}</td>
                <td>{result.flight_date}</td>
                <td>{result.status}</td>
                <td>{result.departure_airport}</td>
                <td>{result.arrival_airport}</td>
                <td>{result.scheduled_departure}</td>
                <td>{result.estimated_departure}</td>
                <td>{result.actual_departure}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <h3>🚗 Driving Information</h3>
            <p><strong>Estimated Travel Time:</strong> {result.estimated_travel_time}</p>
            <p><strong>Leave By:</strong> {result.leave_by}</p>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center', fontWeight: 'bold' }}>
            🧠 <span>AI Suggestion (Compared Last 5 - 7 Flights):</span>
            <p>{result.delay_risk_message}</p>
          </div>
        </div>
      )}

      {result && result.error && <p style={{ color: 'red', textAlign: 'center' }}>{result.error}</p>}
    </div>
  );
}

export default App;
