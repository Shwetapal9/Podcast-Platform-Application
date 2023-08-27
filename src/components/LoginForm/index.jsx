import React, { useState } from "react";
import InputComponent from "../common/Input";
import Button from "../common/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db,auth} from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../utils/slices/userSlice";
import { toast } from "react-toastify";
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import "./styles.css";
function LoginForm() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState("");
  let [forgotPassword,setForgotPassword]= useState(false);
  let [login,setlogin]= useState(true);
  let [newEmail,setNewEmail]= useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlePasswordReset = ()=>{
    setForgotPassword(true);
    setlogin(false);
  }
  const managePassword =(event)=>{
    setNewEmail(event.target.value)
    }
  const handleClose =()=>{
    setlogin(true);
  }
  //Send Mail to reset Password
  const sendResetMail=()=>{  
    setLoading(false);
    const resetPassword = getAuth();
    console.log(resetPassword);
    sendPasswordResetEmail(resetPassword, newEmail)
  .then(() => {
    
    toast.success("Password Reset mail sent successfully")
    setLoading(false);
  })
  .catch((error) => {
    toast.error(error.message);
    setLoading(false);
  });
}


  const handleLogin = async () => {
    setLoading(true);
    if (email && password) {
      try {
        //Creating user's account
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredentials.user;
        console.log("User :", user);

        //Saving user's details.
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        const userData = userDoc.data();
        console.log("UserData",userData)
        //save data in redux, call the redux action
        dispatch(
          setUser({
            name: userData.name,
            email: user.email,
            uid: user.uid,
            ProfilePic: userData.ProfilePic,
          })
        );
        toast.success("Login Successful!");
        setLoading(false);

        navigate("/podcasts");
      } catch (e) {
        console.log("error", e);
        setLoading(false);
        toast.error(e.message);
      }
    } else {
      toast.error("Email and Password Required");
      setLoading(false);
    }
  };

  if(login){
    return (
      <>
        <InputComponent
          state={email}
          setState={setEmail}
          placeholder="Enter your Email"
          type="email"
          required="true"
        />
        <InputComponent
          state={password}
          setState={setPassword}
          placeholder="Enter Password"
          type="password"
          required="true"
        />
        <Button
          text={loading ? "Loading.." : "Login"}
          disabled={loading}
          onClick={handleLogin}
        />
        <p style={{ cursor: "pointer" }} onClick={handlePasswordReset}>Forgot Password</p>
        </>
    )
  }

    return (
      <>
      {forgotPassword? <>
        <div className="reset-wrapper">
          <span className="close" onClick={handleClose}>X</span>
          <p>Enter the email address associated with your account. We will send an email to reset your password.</p>
          <div className="reset">
            <input type="email" placeholder="Enter Registered Email" value={newEmail} onChange={managePassword}></input>
            <button type="reset" onClick={sendResetMail}>Send </button>
          </div>          
        </div>        
        </>: <></>
      }
      </>      
    )
  }  

export default LoginForm ;
