import React, { useState,useEffect } from "react";
import Header from "../components/common/Header";
import { useSelector } from "react-redux";
import Button from "../components/common/Button";
import { signOut } from "firebase/auth";
import { auth,db } from "../firebase";
import { toast } from "react-toastify";
import PodcastShimmer from "../components/common/Shimmer";
import { useNavigate } from "react-router-dom";
import Podcastcard from "../components/Podcasts/PodcastCard";
import { useDispatch } from "react-redux";
import { onSnapshot,collection,query } from "firebase/firestore";
import { setPodcasts } from "../utils/slices/podcastSlice";

function Profile() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const podcasts = useSelector((state) => state.podcasts.podcasts);
  console.log("Logged In User:",user);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts")),
      (querySnapshot) => {
        const podcastsData = [];
        querySnapshot.forEach((doc) => {
          podcastsData.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setPodcasts(podcastsData));
      },
      (error) => {
        console.log("Error in fetching podcasts:", error);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [dispatch]);
  var myPodcasts = podcasts.filter((podcast) =>
      podcast.createdBy == auth.currentUser.uid
  );
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("User Logged Out!");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  if (!user) {
    return <PodcastShimmer/>;
  }
  return (
    <div className="profile">
      <Header />
      <h1>My Profile</h1>
      <div className="profile-wrapper">        
        <img className="profile-pic" src={user.ProfilePic}/>
        <div>
          <h1>{user.name}</h1>
          <h1>{user.email}</h1>        
          <div className="profile-btn">
          <Button text={"Logout"} onClick={handleLogout} />
          <Button text={"Edit Profile"}  />
          </div>
        </div>
      </div>
      <h1>My Podcasts</h1>
      <div className="podcasts-flex">
        {myPodcasts.length>0?(
          <>
          {myPodcasts.map((podcast, index) => {
            return (
              <Podcastcard
                key={podcast.id}
                id={podcast.id}
                title={podcast.title}
                description={podcast.description}                
                displayImage={podcast.displayImage}
              />
            );
        })}</>) 
          :(<div>
          <p>No Podcasts Yet, Create One!!</p>
          <Button text="Create Podcast" onClick={()=>{navigate("/start-a-podcast")}}/>
          </div>)}
        </div>
    </div>
  );
}

export default Profile;
