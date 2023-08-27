import React, { useState } from "react";
import InputComponent from "../common/Input";
import Button from "../common/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db,storage } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../utils/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FileInput from "../common/Input/FileInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [profileImage,setProfileImage]= useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignup = async () => {
    if (
      fullName &&
      email &&
      password === confirmPassword &&
      password.length >= 6
    ) {
      try {
        //Creating user's account
        setLoading(true);
        
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredentials.user;
        //Saving user's details.
        await setDoc(doc(db, "users", user.uid), {
          name: fullName,
          email: user.email,
          uid: user.uid,
          ProfilePic: profileImage,
        });

        //save data in redux, call the redux action
        dispatch(
          setUser({
            name: fullName,
            email: user.email,
            uid: user.uid,
            ProfilePic: profileImage,
          })
        );
        toast.success("Account Created Successfully");
        setLoading(false);
        navigate("./profile");
      } catch (e) {
        console.log("error", e);
        toast.error(e.message);
        setLoading(false);
      }
    } else if (!fullName && !email && !password && !confirmPassword) {
      toast.error("All fields are required.");
      setLoading(false);
    } else {
      if (!fullName) {
        toast.error("Fullname required");
      }
      if (!email) {
        toast.error("Email required");
      }
      if (!password) {
        toast.error("Password required");
      } else if (confirmPassword && password !== confirmPassword) {
        toast.error("Password Mismatched");
      } else if (password.length < 6) {
        toast.error("Password must be greater or equals 6 digit!");
      }
      if (!confirmPassword) {
        toast.error("Confirm Password cannot be empty");
      }
      setLoading(false);
    }
  };
  const handleProfileImage = async (file) => {
    setLoading(true);
    try {
      const profileImageRef = ref(storage, `profile/${Date.now()}`);
      await uploadBytes(profileImageRef, file);

      const profileImageUrl = await getDownloadURL(profileImageRef);
      setProfileImage(profileImageUrl);
      setLoading(false);
      toast.success("Image Uploaded!");
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };
  return (
    <>
      <InputComponent
        state={fullName}
        setState={setFullName}
        placeholder="Enter your Full Name"
        type="text"
        required="true"
      />
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
      <InputComponent
        state={confirmPassword}
        setState={setConfirmPassword}
        placeholder="Confirm Password"
        type="password"
        required="true"
      />
      <FileInput
        accept={"image/*"}
        id="user-img"
        text="Upload Profile Image"
        fileHandle={handleProfileImage}
      />
      <Button
        text={loading ? "Loading.." : "Signup"}
        disabled={loading}
        onClick={handleSignup}
      />
    </>
  );
}

export default SignUpForm;
