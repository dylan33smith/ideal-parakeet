import React, { useState } from "react";
//import ReactDOM from 'react-dom';
import "./index.css";
import "./LoginPage.css";
import "./SignUpPage.css";
import ReminderPage from "../ReminderPage";
import JournalLog from "./JournalLog";
import reportWebVitals from "../reportWebVitals";
//import { doc } from 'firebase/firestore';
import {
  signUpFunc,
  loginFunc,
} from "../components/authentication/authFunctions";
import { createRoot } from "react-dom/client";

const App = () => {
  const [activePage, setActivePage] = useState("Login Page");

  const setPageToSignUp = (e) => {
    e.preventDefault();
    setActivePage("Sign Up Page");
  };

  const setPageToLogin = (e) => {
    e.preventDefault();
    setActivePage("Login Page");
  };

  const togglePage = (e) => {
    e.preventDefault();
    setActivePage(
      activePage === "Reminder Page" ? "Journal Log" : "Reminder Page"
    );
  };

  const logIn = async () => {
    const result = await loginFunc(
      document.getElementById("emailLogIn").value,
      document.getElementById("passwordLogIn").value
    );
    if (result === true) {
      setActivePage("Journal Log");
    } else {
      alert("Error: " + result);
    }
  };

  const signUp = async () => {
    const result = await signUpFunc(
      document.getElementById("emailSignIn").value,
      document.getElementById("passwordSignIn").value
    );
    if (result === true) {
      setActivePage("Journal Log");
    } else {
      alert("Error: " + result);
    }
  };

  const validateUserLogin = (email, password) => {
    return true;
  };

  const validateUserSignUp = (email, password) => {
    return true;
  };

  return (
    <React.StrictMode>
      <>
        {activePage === "Login Page" ? (
          <div className="LoginPage">
            <div className="loginBox">
              <div>
                <h1>Login</h1>
                <form>
                  <div className="textbox">
                    <input
                      type="text"
                      placeholder="Email"
                      name="email"
                      id="emailLogIn"
                    />
                  </div>
                  <div className="textbox">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      id="passwordLogIn"
                    />
                  </div>
                  <br />
                  <button
                    type="button"
                    onClick={() => {
                      const email = document.getElementById("emailLogIn").value;
                      const password =
                        document.getElementById("passwordLogIn").value;
                      if (validateUserLogin(email, password)) {
                        logIn();
                      } else {
                        alert("Invalid credentials");
                      }
                    }}
                  >
                    Log In
                  </button>
                  <br />
                  <button onClick={(e) => setPageToSignUp(e)}>Sign Up</button>
                </form>
              </div>
            </div>
          </div>
        ) : activePage === "Sign Up Page" ? (
          <div className="SignUpPage">
            <div className="signUpBox">
              <div>
                <h1>Sign Up</h1>
                <form>
                  <div className="textbox">
                    <input
                      type="text"
                      placeholder="Email"
                      name="email"
                      id="emailSignIn"
                    />
                  </div>
                  <div className="textbox">
                    <input
                      type="password"
                      placeholder="Password"
                      name="password"
                      id="passwordSignIn"
                    />
                  </div>
                  <br />
                  <button
                    type="button"
                    onClick={() => {
                      const email =
                        document.getElementById("emailSignIn").value;
                      const password =
                        document.getElementById("passwordSignIn").value;
                      if (validateUserSignUp(email, password)) {
                        signUp();
                      } else {
                        alert("Invalid credentials");
                      }
                    }}
                  >
                    Sign Up
                  </button>
                  <br />
                  <button onClick={(e) => setPageToLogin(e)}>
                    Back to Login Page
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : activePage === "Journal Log" ? (
          <>
            <JournalLog
              togglePage={togglePage}
              setPageToLogin={setPageToLogin}
            />
          </>
        ) : (
          <>
            <ReminderPage
              togglePage={togglePage}
              setPageToLogin={setPageToLogin}
            />
          </>
        )}
      </>
    </React.StrictMode>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
reportWebVitals();
