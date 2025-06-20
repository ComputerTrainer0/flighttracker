import React, { useState } from 'react';
import './App.css';

function App() {
  const [flight, setFlight] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('today');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    setData(null);
    try {
      const res = await fetch(
        `https://17hovlzcka.execute-api.us-east-1.amazonaws.com/departure?flight=${flight}&location=${encodeURIComponent(
          location
        )}&date=${date}`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="App">
      <h1 className="title">AI Flight Departure Tracker</h1>
      <div className="form">
        <input
          placeholder="Flight Number (e.g. BA198)"
          value={flight}
          onChange={(e) => setFlight(e.target.value)}
        />
        <input
          placeholder="Your Start Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select value={date} onChange={(e) => setDate(e.target.value)}>
          <option value="yesterday">Yesterday</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
        </select>
        <button onClick={handleSubmit}>Track Departure</button>
      </div>

      {error && <div className="error">{error}</div>}

      {data && (
        <div className="results">
          <table>
            <thead>
              <tr>
                <th>Flight No.</th>
                <th>Date</th>
                <th>Status</th>
                <th>From</th>
                <th>To</th>
                <th>Scheduled</th>
                <th>Estimated</th>
                <th>Actual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.flight_number}</td>
                <td>{data.flight_date}</td>
                <td>{data.status}</td>
                <td>{data.departure_airport}</td>
                <td>{data.arrival_airport}</td>
                <td>{data.scheduled_departure}</td>
                <td>{data.estimated_departure}</td>
                <td>{data.actual_departure}</td>
              </tr>
            </tbody>
          </table>

          <h2>Driving Information</h2>
          <p>
            Estimated Travel Time: <strong>{data.estimated_travel_time}</strong>
          </p>
          <p>
            You should leave by: <strong>{data.leave_by}</strong>
          </p>

          <h2 className="ai-title">AI Suggestion (Compared Last 5 - 7 Flights)</h2>
          <p className="ai-msg">{data.delay_risk_message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
