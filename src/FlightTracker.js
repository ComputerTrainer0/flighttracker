import React, { useState } from 'react';
import axios from 'axios';

export default function FlightTracker() {
  const [flightNumber, setFlightNumber] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'https://your-api-id.execute-api.region.amazonaws.com/flight'; // replace with your actual API Gateway URL

  const handleTrackFlight = async () => {
    if (!flightNumber || !location) {
      setError('Please enter both flight number and location.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.get(API_URL, {
        params: {
          flight: flightNumber,
          location: location
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
    <div className="min-h-screen bg-gray-50 p-6">
      <head>
        <title>AI Flight Tracker</title>
      </head>
      <h1 className="text-3xl font-bold mb-4 text-center">AI Flight Tracker</h1>

      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Flight Number</label>
          <input
            type="text"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g. BA663"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Your Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="e.g. Bracknell"
          />
        </div>

        <button
          onClick={handleTrackFlight}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? 'Loading...' : 'Track Flight'}
        </button>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        {result && (
          <div className="mt-6 border-t pt-4">
            <h2 className="text-lg font-semibold mb-2">Flight Information</h2>
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Arrival Airport:</strong> {result.arrival_airport} (Terminal {result.arrival_terminal})</p>
            <p><strong>Scheduled Arrival:</strong> {result.scheduled_arrival}</p>
            <p><strong>Estimated Arrival:</strong> {result.estimated_arrival}</p>
            <p><strong>Actual Arrival:</strong> {result.actual_arrival}</p>
            <p><strong>Travel Time:</strong> {result.estimated_travel_time}</p>
            <p><strong>Leave By:</strong> {result.leave_by}</p>
            {result.delay_risk_message && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700">AI Suggestion:</h3>
                <p className="text-yellow-600 font-medium">{result.delay_risk_message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
