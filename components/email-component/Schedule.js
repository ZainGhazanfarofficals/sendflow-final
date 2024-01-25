"use client"
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './schedule.css'

export default function CalendarGfg({ takedateInfo, dateInfo, schedule:propdate }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState(dateInfo?.hours || 0);
  const [selectedMinutes, setSelectedMinutes] = useState(dateInfo?.minutes || 0);
  const [selectedSeconds, setSelectedSeconds] = useState(dateInfo?.seconds || 0);
  const [error, setError] = useState('');


  useEffect(() => {
    if (propdate) {
      const data = JSON.parse(propdate);
      console.log(data);
      setSelectedHours(data.hours);
      setSelectedMinutes(data.minutes);
      setSelectedSeconds(data.seconds);
    }
  }, [propdate]);



  
  const updateTime = () => {
    setCurrentTime(new Date());
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Update the time every second
  useEffect(() => {
    const intervalId = setInterval(updateTime, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  
  const sendEmailAtCurrentTime = () => {
    const currentDateTime = new Date();
    currentDateTime.setMinutes(currentDateTime.getMinutes() + 1);
    const currentDateTimeInfo = {
      day: currentDateTime.toLocaleDateString('en-US', { weekday: 'short' }),
      month: currentDateTime.toLocaleDateString('en-US', { month: 'short' }),
      date: currentDateTime.getDate(),
      hours: currentDateTime.getHours(),
      minutes: currentDateTime.getMinutes(),
      seconds: currentDateTime.getSeconds(),
      
    };
    setSelectedHours(currentDateTime.getHours());
    setSelectedMinutes(currentDateTime.getMinutes());
    setSelectedSeconds(currentDateTime.getSeconds());
    takedateInfo(currentDateTimeInfo);
  };

  const submitDate = () => {
    if (
      selectedHours === 0 &&
      selectedMinutes === 0 &&
      selectedSeconds === 0
    ) 
    {
      // If no specific time is selected, send email at the current time
      sendEmailAtCurrentTime();
      
    } 
    
    else {
      // ... rest of your submitDate logic for scheduling
      
  
    const selectedDateInfo = {
      day: selectedDate.toLocaleDateString('en-US', { weekday: 'short' }),
      month: selectedDate.toLocaleDateString('en-US', { month: 'short' }),
      date: selectedDate.getDate(),
      hours: selectedHours,
      minutes: selectedMinutes,
      seconds: selectedSeconds,
    };

    // Calculate the selected date and time as a JavaScript Date object
    const selectedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedHours,
      selectedMinutes,
      selectedSeconds
    );

    // Check if the selected date and time are in the past
    if (selectedDateTime <= currentTime) {
      setError('Cannot schedule Time in the past.');
      setTimeout(() => {
        setError('');
      }, 2000);
      return;
    }

    // Clear the error if it was previously set
    setError('');

    
    takedateInfo(selectedDateInfo);
  
    }
  };


  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  const secondOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="calendar-container">
    <div className="flex-container">
        <div>
          <label className="select-label">Select Hour:</label>
          <select
            value={selectedHours}
            onChange={(e) => setSelectedHours(Number(e.target.value))}
            className="select-input"
          >
            {hourOptions.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
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
            {minuteOptions.map((minute) => (
              <option key={minute} value={minute}>
                {minute}
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
            {secondOptions.map((second) => (
              <option key={second} value={second}>
                {second}
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

      <strong >Current Time:</strong>
      <div>{currentTime.toLocaleTimeString()}</div>

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
