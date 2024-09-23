"use client";
import React, { useState, useCallback } from "react";
import { useAppSelector } from "@/hooks/reduxHook";

interface Option {
  value: string;
  label: string;
}

interface ScheduleData {
  [day: string]: {
    [time: string]: Option | null;
  };
}

function generateTimeSegments(): string[] {
  const segments: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      segments.push(time);
    }
  }
  return segments;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeSegments = generateTimeSegments();

const ScheduleTemplate: React.FC = () => {
  const { patterns } = useAppSelector((state) => state.userDevice);
  const patternsOptions: Option[] = patterns.map((pattern) => ({
    value: pattern.name.toLowerCase(),
    label: pattern.name,
  }));
  const [dayToClear, setDayToClear] = useState<string>("");
  const [schedule, setSchedule] = useState<ScheduleData>({});
  const [sourceDayToDuplicate, setSourceDayToDuplicate] =
    useState<string>("Monday");
  const [targetDayToDuplicate, setTargetDayToDuplicate] =
    useState<string>("All");

  const handleChange = useCallback(
    (day: string, time: string, selectedValue: string) => {
      const selectedOption =
        patternsOptions.find((option) => option.value === selectedValue) ||
        null;
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        [day]: {
          ...prevSchedule[day],
          [time]: selectedOption,
        },
      }));
    },
    [patternsOptions]
  );

  const duplicateDay = () => {
    const sourceSchedule = schedule[sourceDayToDuplicate] || {};
    setSchedule((prevSchedule) => {
      const newSchedule = { ...prevSchedule };
      if (targetDayToDuplicate === "All") {
        daysOfWeek.forEach((day) => {
          if (day !== sourceDayToDuplicate) {
            newSchedule[day] = { ...sourceSchedule };
          }
        });
      } else {
        newSchedule[targetDayToDuplicate] = { ...sourceSchedule };
      }
      return newSchedule;
    });
  };

  const clearDay = () => {
    setSchedule((prevSchedule) => {
      const newSchedule = { ...prevSchedule };
      delete newSchedule[dayToClear];
      return newSchedule;
    });
  };

  const clearAllDays = () => {
    setSchedule({});
  };

  const saveSchedule = () => {
    console.log("Schedule", schedule);
  };

  return (
    <div className="schedule__container">
      <div className="schedule__table-wrapper">
        <table className="schedule__table">
          <thead>
            <tr>
              <th className="schedule__header" rowSpan={2}>
                Time
              </th>
              {daysOfWeek.map((day) => (
                <th key={day} className="schedule__header">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSegments.map((time) => (
              <tr key={time}>
                <td className="schedule__time">{time}</td>
                {daysOfWeek.map((day) => (
                  <td key={`${day}-${time}`} className="schedule__select">
                    <select
                      onChange={(e) => handleChange(day, time, e.target.value)}
                      value={schedule[day]?.[time]?.value || ""}
                      className="schedule__select-field"
                    >
                      <option value="">Select</option>
                      {patternsOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="schedule__actions">
        <div className="schedule__duplicate-controls">
          <select
            value={sourceDayToDuplicate}
            onChange={(e) => setSourceDayToDuplicate(e.target.value)}
            className="schedule__select-day"
          >
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <span>to</span>
          <select
            value={targetDayToDuplicate}
            onChange={(e) => setTargetDayToDuplicate(e.target.value)}
            className="schedule__select-day"
          >
            <option value="All">All Days</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <button
            onClick={duplicateDay}
            className="schedule__button schedule__button--blue"
          >
            Duplicate
          </button>
        </div>
        <div className="schedule__clear-controls">
          <select
            value={dayToClear}
            className="schedule__select-day"
            onChange={(e) => setDayToClear(e.target.value)}
          >
            <option value="">Select day to clear</option>
            {daysOfWeek.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <button
            onClick={clearDay}
            className="schedule__button schedule__button--red"
          >
            Clear Day
          </button>
          <button
            onClick={clearAllDays}
            className="schedule__button schedule__button--red"
          >
            Clear All Days
          </button>
        </div>
        <button
          onClick={saveSchedule}
          className="schedule__button schedule__button--green"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleTemplate;