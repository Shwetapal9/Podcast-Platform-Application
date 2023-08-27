import React, { useState } from "react";
import Header from "../components/common/Header";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";

function Form() {
  let [flag, setFlag] = useState(false);
  return (
    <div>
      <Header />
      <div className="input-wrapper">
        {!flag ? <h1>Sign Up</h1> : <h1>Log In</h1>}
        {!flag ? <SignUpForm /> : <LoginForm />}
        {!flag ? (
          <p
            style={{ cursor: "pointer" }}
            onClick={() => {
              setFlag(!flag);
            }}
          >
            Existing User? Click here to Login.
          </p>
        ) : (
          <p
            style={{ cursor: "pointer" }}
            onClick={() => {
              setFlag(!flag);
            }}
          >
            New User? Click here to Signup.
          </p>
        )}
      </div>
    </div>
  );
}

export default Form;
