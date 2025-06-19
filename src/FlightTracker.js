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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6 font-sans flex flex-col items-center justify-center">
      <head>
        <title>AI Flight Arrival Tracker</title>
      </head>
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-800 drop-shadow-sm">AI Flight Arrival Tracker ✈️</h1>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8">
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
            <option value="yesterday">Yesterday</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
          </select>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleTrackFlight}
            disabled={loading}
            className="bg-indigo-600 text-white py-3 px-6 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition duration-200"
          >
            {loading ? 'Loading...' : 'Track Flight'}
          </button>
        </div>

        {error && <p className="mt-4 text-red-600 text-sm text-center font-medium">{error}</p>}

        {result && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Flight Information</h2>
            <table className="w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
              <tbody className="text-gray-800">
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold">Flight Date</td>
                  <td className="px-4 py-2">{result.flight_date}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold">Flight To</td>
                  <td className="px-4 py-2">{result.arrival_airport} (Terminal {result.arrival_terminal || 'N/A'})</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Status</td>
                  <td className="px-4 py-2">{result.status}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold">Scheduled Arrival</td>
                  <td className="px-4 py-2">{result.scheduled_arrival}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Estimated Arrival</td>
                  <td className="px-4 py-2">{result.estimated_arrival}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold">Actual Arrival</td>
                  <td className="px-4 py-2">{result.actual_arrival}</td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-indigo-700">Driving Information</h2>
            <table className="w-full table-auto border border-gray-300 rounded-lg overflow-hidden">
              <tbody className="text-gray-800">
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold">Estimated Travel Time</td>
                  <td className="px-4 py-2">{result.estimated_travel_time}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold">Leave By</td>
                  <td className="px-4 py-2">{result.leave_by}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-4 py-2 font-semibold">Traffic</td>
                  <td className="px-4 py-2">{result.traffic_condition}</td>
                </tr>
              </tbody>
            </table>

            {result.delay_risk_message && (
              <div className="mt-6 text-center">
                <h3 className="text-md font-bold text-yellow-700 mb-1">AI Suggestion (Compared Last 5 - 7 Flights):</h3>
                <p className="text-yellow-800 font-medium">{result.delay_risk_message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
