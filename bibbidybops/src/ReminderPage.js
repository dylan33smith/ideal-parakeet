import React, { useEffect, useState } from "react";
import "./ReminderPage.css";
import {
  addReminder,
  getReminders,
  removeReminder,
} from "./components/reminders/reminderFunctions";
import { auth } from "./config/firebase";

const reminderEntryGetter = async (setReminderArray) => {
  const reminders = await getReminders();
  const userReminders = reminders.filter(
    (reminder) => reminder.userID === auth.currentUser.uid
  );
  setReminderArray(userReminders);
  return userReminders;
};

const ReminderPage = ({ togglePage, setPageToLogin }) => {
  // Create an array of objects for the reminders
  const [reminderArray, setReminderArray] = React.useState([]);

  useEffect(() => {
    reminderEntryGetter(setReminderArray);
  }, []);

  function addLocalReminder(
    description,
    frequencyType,
    date,
    days,
    frequency,
    scale,
    reminderTime
  ) {
    const currTime = Date.now();
    setReminderArray((prevArray) => [
      ...prevArray,
      {
        description: description,
        index: currTime,
        frequencyType: frequencyType,
        date: date,
        days: days,
        frequency: frequency,
        scale: scale,
        reminderTime: reminderTime,
      },
    ]);
    addReminder({
      description: description,
      index: currTime,
      frequencyType: frequencyType,
      date: date,
      days: days,
      frequency: frequency,
      scale: scale,
      reminderTime: reminderTime,
    });
  }

  function removeLocalReminder(index) {
    setReminderArray((prevArray) =>
      prevArray.filter((reminder) => reminder.index !== index)
    );
    removeReminder(auth.currentUser.uid + "_" + index);
  }

  const NavBar = (props) => {
    return (
      <nav>
        <div className="nav-name">{props.title}</div>
      </nav>
    );
  };

  const Reminder = (props) => {
    const index = props.index;

    const frequencyType = props.frequencyType;
    const date = props.date;
    const days = props.days;
    const frequency = props.frequency;
    const scale = props.scale;
    const reminderTime = props.reminderTime;

    return (
      <>
        <h1>Reminder</h1>
        <p>{props.description}</p>
        <p>
          {frequencyType === "onDate"
            ? `On ${date} at ${reminderTime}`
            : frequencyType === "repeat"
            ? // Display the days of the week that are checked
              `Repeat on ${days
                .map((day, index) =>
                  day
                    ? index === 0
                      ? "Sunday"
                      : index === 1
                      ? "Monday"
                      : index === 2
                      ? "Tuesday"
                      : index === 3
                      ? "Wednesday"
                      : index === 4
                      ? "Thursday"
                      : index === 5
                      ? "Friday"
                      : "Saturday"
                    : null
                )
                .filter((day) => day !== null)
                .join(", ")} at ${reminderTime}`
            : /* frequencyType === 'iterative' */
              `Every ${frequency} ${scale} at ${reminderTime}`}
        </p>
        <button type="button" onClick={() => props.removeLocalReminder(index)}>
          Remove
        </button>
      </>
    );
  };

  const [frequencyType, setFrequencyType] = React.useState("onDate");

  return (
    <div className="ReminderPage">
      <NavBar title={"Ideal Parakeet"} />
      <div class="sidenav">
        <button onClick={(e) => togglePage(e)}>Journal Logs</button>
        <br />
        <button>Reminders</button>
        <br />
        <button onClick={(e) => setPageToLogin(e)}>Log Out</button>
      </div>
      <div className="createReminderBox">
        <h2>Create a Reminder</h2>

        <label
          htmlFor="name"
          style={{ display: "inline-block", width: "150px" }}
        >
          Reminder Title:
        </label>
        <input type="text" id="reminderTitle" placeholder="Journal" />

        <br />

        {/* Frequency Type */}
        <label
          htmlFor="frequencyType"
          style={{ display: "inline-block", width: "150px" }}
        >
          Frequency Type:
        </label>
        <select
          name="frequencyType"
          id="frequencyType"
          onChange={(e) => setFrequencyType(e.target.value)}
        >
          <option value="onDate">On Date</option>
          <option value="repeat">Repeat on days</option>
          <option value="iterative">Every # days/weeks/months</option>
        </select>

        <br />

        {frequencyType === "onDate" ? (
          <>
            <label
              htmlFor="date"
              style={{ display: "inline-block", width: "150px" }}
            >
              Reminder Date:
            </label>
            <input type="date" id="reminderDate" />
          </>
        ) : frequencyType === "repeat" ? (
          <>
            <div style={{ display: "inline-block" }}>
              <label htmlFor="sunday">Sun</label>
              <input type="checkbox" id="sunday" />
              <label htmlFor="monday">Mon</label>
              <input type="checkbox" id="monday" />
              <label htmlFor="tuesday">Tue</label>
              <input type="checkbox" id="tuesday" />
              <label htmlFor="wednesday">Wed</label>
              <input type="checkbox" id="wednesday" />
              <label htmlFor="thursday">Thu</label>
              <input type="checkbox" id="thursday" />
              <label htmlFor="friday">Fri</label>
              <input type="checkbox" id="friday" />
              <label htmlFor="saturday">Sat</label>
              <input type="checkbox" id="saturday" />
            </div>
          </>
        ) : (
          /* frequencyType === 'iterative' */ <>
            <label
              htmlFor="iterativeFrequency"
              style={{ display: "inline-block", width: "110px" }}
            >
              Frequency:
            </label>
            <input type="number" id="iterativeFrequency" />
            <select name="iterativeFrequencyType" id="iterativeFrequencyType">
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </>
        )}

        <br />

        <label
          htmlFor="reminderTime"
          style={{ display: "inline-block", width: "150px" }}
        >
          Reminder Time:
        </label>
        <input type="time" id="reminderTime" />

        <br />

        <button
          className="createReminderButton"
          type="button"
          onClick={
            frequencyType === "onDate"
              ? () =>
                  addLocalReminder(
                    document.getElementById("reminderTitle").value,
                    "onDate",
                    document.getElementById("reminderDate").value,
                    null,
                    null,
                    null,
                    document.getElementById("reminderTime").value
                  )
              : frequencyType === "repeat"
              ? () =>
                  addLocalReminder(
                    document.getElementById("reminderTitle").value,
                    "repeat",
                    null,
                    [
                      document.getElementById("sunday").checked,
                      document.getElementById("monday").checked,
                      document.getElementById("tuesday").checked,
                      document.getElementById("wednesday").checked,
                      document.getElementById("thursday").checked,
                      document.getElementById("friday").checked,
                      document.getElementById("saturday").checked,
                    ],
                    null,
                    null,
                    document.getElementById("reminderTime").value
                  )
              : /* frequencyType === 'iterative' */ () =>
                  addLocalReminder(
                    document.getElementById("reminderTitle").value,
                    "iterative",
                    null,
                    null,
                    document.getElementById("iterativeFrequency").value,
                    document.getElementById("iterativeFrequencyType").value,
                    document.getElementById("reminderTime").value
                  )
          }
        >
          Create Reminder
        </button>
      </div>

      <div className="divider">
        <h1>Current Reminders</h1>
      </div>

      {reminderArray.map((reminder, index) => (
        <div className="reminderBox">
          <Reminder
            key={reminder.index}
            index={reminder.index}
            description={reminder.description}
            frequencyType={reminder.frequencyType}
            date={reminder.date}
            days={reminder.days}
            frequency={reminder.frequency}
            scale={reminder.scale}
            reminderTime={reminder.reminderTime}
            removeLocalReminder={removeLocalReminder}
          />
        </div>
      ))}

      <header className="App-header"></header>
    </div>
  );
};

export default ReminderPage;
