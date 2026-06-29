import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarGfg({
  takedateInfo,
  dateInfo,
  schedule: propdate,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState(dateInfo?.hours || 0);
  const [selectedMinutes, setSelectedMinutes] = useState(
    dateInfo?.minutes || 0
  );
  const [selectedSeconds, setSelectedSeconds] = useState(
    dateInfo?.seconds || 0
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (propdate) {
      const data = JSON.parse(propdate);
      setSelectedHours(data.hours);
      setSelectedMinutes(data.minutes);
      setSelectedSeconds(data.seconds);
    }
  }, [propdate]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleDateChange = (date) => setSelectedDate(date);

  const sendEmailAtCurrentTime = () => {
    const currentDateTimeUTC = new Date();

    const currentDateTimeInfo = {
      year: currentDateTimeUTC.getUTCFullYear(),
      month: currentDateTimeUTC.getUTCMonth(), // 0-11
      date: currentDateTimeUTC.getUTCDate(),
      day: currentDateTimeUTC.getUTCDay(),     // 0-6 (Sun = 0)
      hours: currentDateTimeUTC.getUTCHours(),
      minutes: currentDateTimeUTC.getUTCMinutes() + 2, // slight offset
      seconds: currentDateTimeUTC.getUTCSeconds(),
    };

    setSelectedHours(currentDateTimeInfo.hours);
    setSelectedMinutes(currentDateTimeInfo.minutes);
    setSelectedSeconds(currentDateTimeInfo.seconds);
    takedateInfo(currentDateTimeInfo);
  };

  const submitDate = () => {
    if (selectedHours === 0 && selectedMinutes === 0 && selectedSeconds === 0) {
      sendEmailAtCurrentTime();
    } else {
      const selectedDateTimeUTC = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          selectedHours,
          selectedMinutes,
          selectedSeconds
        )
      );

      const currentUTC = new Date();
      if (selectedDateTimeUTC < currentUTC) {
        setError("Cannot schedule time in the past.");
        setTimeout(() => setError(""), 2000);
        return;
      }

      const selectedDateInfoUTC = {
        year: selectedDateTimeUTC.getUTCFullYear(),
        month: selectedDateTimeUTC.getUTCMonth(), // 0-11
        date: selectedDateTimeUTC.getUTCDate(),
        day: selectedDateTimeUTC.getUTCDay(),     // 0-6
        hours: selectedDateTimeUTC.getUTCHours(),
        minutes: selectedDateTimeUTC.getUTCMinutes(),
        seconds: selectedDateTimeUTC.getUTCSeconds(),
      };

      setError("");
      takedateInfo(selectedDateInfoUTC);
    }
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  const secondOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-50 shadow-2xl backdrop-blur">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300">
            Schedule
          </p>
          <p className="text-sm text-slate-200">
            Pick a send date and exact UTC time.
          </p>
        </div>
        <button
          onClick={sendEmailAtCurrentTime}
          className="rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-3 py-2 text-xs font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
        >
          Send now (UTC)
        </button>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-slate-900/40 p-3 shadow-inner">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-300">
            Date
          </div>
          <Calendar
            className="w-full rounded-xl border border-white/10 bg-white/5 p-2 text-slate-900"
            onChange={handleDateChange}
            value={selectedDate}
            minDate={new Date()}
          />
        </div>

        <div className="space-y-3 rounded-xl border border-white/10 bg-slate-900/40 p-4 shadow-inner">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-200">Hour (UTC)</label>
              <select
                value={selectedHours}
                onChange={(e) => setSelectedHours(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 focus:border-emerald-300 focus:outline-none"
              >
                {hourOptions.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-200">Minutes</label>
              <select
                value={selectedMinutes}
                onChange={(e) => setSelectedMinutes(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 focus:border-emerald-300 focus:outline-none"
              >
                {minuteOptions.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-200">Seconds</label>
              <select
                value={selectedSeconds}
                onChange={(e) => setSelectedSeconds(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-slate-100 focus:border-emerald-300 focus:outline-none"
              >
                {secondOptions.map((second) => (
                  <option key={second} value={second}>
                    {second.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200">
            Current UTC time:{" "}
            <span className="font-semibold text-emerald-300">
              {currentTime.toUTCString().slice(17, 25)}
            </span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={submitDate}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
            >
              Save schedule
            </button>
          </div>

          {error && (
            <p className="text-sm text-rose-200" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
