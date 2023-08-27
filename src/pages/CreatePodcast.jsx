import React from "react";
import Header from "../components/common/Header";
import CreatePodcastForm from "../components/StartPodcast/CreatePodcastForm";

function CreatePodcast() {
  return (
    <>
      <Header />
      <div className="input-wrapper">
        <h1>Create A Podcast</h1>
        <CreatePodcastForm />
      </div>
    </>
  );
}

export default CreatePodcast;
