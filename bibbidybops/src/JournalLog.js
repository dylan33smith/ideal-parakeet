import { Plate, PlateContent } from "@udecode/plate-common";
import React, { useState, useEffect } from "react";
import "./JournalLog.css";
import {
  getJournalEntries,
  replaceJournalEntry,
} from "../components/journaling/journalDbFunctions";
import { auth } from "../config/firebase";
import { doc } from "firebase/firestore";

function NavBar() {
  return (
    <nav>
      <div className="nav-name">Ideal Parakeet</div>
    </nav>
  );
}

async function saveEdits(setShowEditor, popupContent, setJournalArray) {
  setShowEditor(false);
  const editBoxValue = document.getElementById("editBox").value;
  console.log(auth.currentUser.uid + "_" + popupContent.dateTime);
  replaceJournalEntry({
    title: popupContent.title,
    docID: auth.currentUser.uid + "_" + popupContent.dateTime,
    body: editBoxValue,
  });

  const updatedJournalEntries = await journalEntryGetter(setJournalArray);
  setJournalArray(updatedJournalEntries);
}

const journalEntryGetter = async (setJournalArray) => {
  const journalEntries = await getJournalEntries();
  const userJournalEntries = journalEntries.filter(
    (entry) => entry.id.split("_")[0] === auth.currentUser.uid
  );
  setJournalArray(userJournalEntries);
  return userJournalEntries;
};

function JournalLog({ togglePage, setPageToLogin }) {
  const [showPopup, setShowPopup] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [popupContent, setPopupContent] = useState({
    title: "",
    dateTime: "",
    body: "",
  });

  const [journalArray, setJournalArray] = React.useState([]);

  useEffect(() => {
    journalEntryGetter(setJournalArray);
  }, []);

  const handleBoxClick = (event) => {
    const box = event.currentTarget.parentNode;
    const title = box.querySelector(".title").textContent;
    const dateTime = box.querySelector(".date-time").textContent;
    const body = box.querySelector(".body").textContent;

    setPopupContent({ title, dateTime, body });
    setShowPopup(true);
  };

  const handleImgClick = (event) => {
    const box = event.currentTarget.parentNode;
    const title = box.querySelector(".title").textContent;
    const dateTime = box.querySelector(".date-time").textContent;
    const body = box.querySelector(".body").textContent;

    setPopupContent({ title, dateTime, body });
    setShowEditor(true);
  };

  return (
    <div className="JournalLog">
      <NavBar />
      <div class="sidenav">
        <button>Journal Logs</button>
        <br />
        <button onClick={(e) => togglePage(e)}>Reminders</button>
        <br />
        <button onClick={(e) => setPageToLogin(e)}>Log Out</button>
      </div>
      {journalArray.length > 0 ? (
        <div className="firstBox">
          <img
            src="/images/R.png"
            alt="img"
            className="firstImg"
            onClick={handleImgClick}
          />
          <h1 className="title">{journalArray[0].title}</h1>
          <h1 className="date-time">{journalArray[0].dateTime}</h1>
          <p className="body" onClick={handleBoxClick}>
            {journalArray[0].body}
          </p>
        </div>
      ) : (
        <div className="firstBox">
          <br />
          <br />
          <h1 className="title">No Entries Found!</h1>
          <h1 className="date-time">N/A</h1>
          <p className="body" onClick={handleBoxClick}>
            No journal entries found. Reply to a reminder email to create a new
            entry.
          </p>
        </div>
      )}

      {journalArray.slice(1).map((entry, index) => (
        <div className="box" key={index}>
          <img
            src="/images/R.png"
            alt="img"
            className="img"
            onClick={handleImgClick}
          />
          <h1 className="title">{entry.title}</h1>
          <h1 className="date-time">{entry.dateTime}</h1>
          <p className="body" onClick={handleBoxClick}>
            {entry.body}
          </p>
        </div>
      ))}

      {showPopup && (
        <div className="popup">
          <h1 className="title">{popupContent.title}</h1>
          <h1 className="date-time">{popupContent.dateTime}</h1>
          <p className="body">{popupContent.body}</p>
          <button className="button" onClick={() => setShowPopup(false)}>
            Close
          </button>
        </div>
      )}

      {showEditor && (
        <div className="popup">
          <input
            className="editBox"
            type="text"
            placeholder="Type..."
            name="editBox"
            id="editBox"
            defaultValue={popupContent.body}
          />
          <br />
          <button
            className="button"
            onClick={() =>
              saveEdits(setShowEditor, popupContent, setJournalArray)
            }
          >
            Save
          </button>
          <button className="button" onClick={() => setShowEditor(false)}>
            Close
          </button>
        </div>
      )}

      <header className="App-header"></header>
    </div>
  );
}

export default JournalLog;
