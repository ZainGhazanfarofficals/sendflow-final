import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './schedule.css';

export default function CalendarGfg({ takedateInfo, dateInfo, schedule: propdate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState(dateInfo?.hours || 0);
  const [selectedMinutes, setSelectedMinutes] = useState(dateInfo?.minutes || 0);
  const [selectedSeconds, setSelectedSeconds] = useState(dateInfo?.seconds || 0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (propdate) {
      const data = JSON.parse(propdate);
      setSelectedHours(data.hours);
      setSelectedMinutes(data.minutes);
      setSelectedSeconds(data.seconds);
    }
  }, [propdate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const submitDate = () => {
    // Create a UTC Date object directly from the selected date and UTC time parts
    const selectedDateTimeUTC = new Date(Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedHours,
      selectedMinutes,
      selectedSeconds
    ));
  
    // Get the current UTC time for comparison
    const currentUTC = new Date();
  
    // Compare the selected UTC date and time with the current UTC time
    if (selectedDateTimeUTC < currentUTC) {
      setError('Cannot schedule time in the past.');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
  
    const dateInfoUTC = {
      day: selectedDateTimeUTC.getUTCDay(),
      month: selectedDateTimeUTC.getUTCMonth(),
      date: selectedDateTimeUTC.getUTCDate(),
      hours: selectedDateTimeUTC.getUTCHours(),
      minutes: selectedDateTimeUTC.getUTCMinutes(),
      seconds: selectedDateTimeUTC.getUTCSeconds(),
    };
  
    setError('');
    takedateInfo(dateInfoUTC);
  };
  
  

  return (
    <div className="calendar-container">
      <div className="flex-container">
        {/* Hour, Minute, and Second selectors */}
        <div>
          <label className="select-label">Select Hour:</label>
          <select
            value={selectedHours}
            onChange={(e) => setSelectedHours(Number(e.target.value))}
            className="select-input"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="select-label">Select Minute:</label>
          <select
            value={selectedMinutes}
            onChange={(e) => setSelectedMinutes(Number(e.target.value))}
            className="select-input"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="select-label">Select Second:</label>
          <select
            value={selectedSeconds}
            onChange={(e) => setSelectedSeconds(Number(e.target.value))}
            className="select-input"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()} // Prevent selecting past dates
        />
      </div>

      <strong>Current Time (UTC):</strong>
      <div>{new Date().toISOString()}</div>

      <div>
        <button
          onClick={submitDate}
          className="button-schedule"
        >
          Set Schedule
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
