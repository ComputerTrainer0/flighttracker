import React, { useState } from 'react';
import axios from 'axios';

export default function FlightTracker() {
  const [flightNumber, setFlightNumber] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('today');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

	  const API_URL = 'https://x0k8f87esd.execute-api.us-east-1.amazonaws.com/GetFlightPickupInfo'; // replace with your actual API Gateway URL

  const handleTrackFlight = async () => {
    if (!flightNumber || !location) {
      setError('Please enter flight number, location, and date.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(API_URL, {
        params: {
          flight: flightNumber,
          location: location,
          date: date
        }
      });
      setResult(response.data);
    } catch (err) {
      setError('Failed to fetch flight data. Please check inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6 font-sans">
      <head>
        <title>AI Flight Tracker</title>
      </head>
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-800 drop-shadow-sm">AI Flight Tracker ✈️</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="mb-6">
          <label className="block text-md font-semibold text-gray-800 mb-1">Flight Number</label>
          <input
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. BA663"
          />
        </div>

        <div className="mb-6">
          <label className="block text-md font-semibold text-gray-800 mb-1">Your Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. Bracknell"
          />
        </div>

        <div className="mb-6">
          <label className="block text-md font-semibold text-gray-800 mb-1">Select Date</label>
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
          </select>
        </div>

        <button
          onClick={handleTrackFlight}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition duration-200"
        >
          {loading ? 'Loading...' : 'Track Flight'}
        </button>

        {error && <p className="mt-4 text-red-600 text-sm text-center font-medium">{error}</p>}

        {result && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Flight Information</h2>
            <div className="space-y-2 text-gray-800">
              <p><strong>Status:</strong> {result.status}</p>
              <p><strong>Arrival Airport:</strong> {result.arrival_airport} (Terminal {result.arrival_terminal})</p>
              <p><strong>Scheduled Arrival:</strong> {result.scheduled_arrival}</p>
              <p><strong>Estimated Arrival:</strong> {result.estimated_arrival}</p>
              <p><strong>Actual Arrival:</strong> {result.actual_arrival}</p>
              <p><strong>Travel Time:</strong> {result.estimated_travel_time}</p>
              <p><strong>Leave By:</strong> {result.leave_by}</p>
            </div>
            {result.delay_risk_message && (
              <div className="mt-6 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg">
                <h3 className="text-md font-bold text-yellow-700 mb-1">AI Suggestion:</h3>
                <p className="text-yellow-800 font-medium">{result.delay_risk_message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
