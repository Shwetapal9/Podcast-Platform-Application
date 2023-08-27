import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { setPodcasts } from "../utils/slices/podcastSlice";
import { useDispatch, useSelector } from "react-redux";
import Podcastcard from "../components/Podcasts/PodcastCard";
import InputComponent from "../components/common/Input";
import PodcastShimmer from "../components/common/Shimmer";

function Podcasts() {
  const dispatch = useDispatch();
  const podcasts = useSelector((state) => state.podcasts.podcasts);
  console.log(podcasts);
  const [search, setSearch] = useState("");
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
  var filteredPodcasts = podcasts.filter((podcast) =>
    podcast.title.trim().toLowerCase().includes(search.trim().toLowerCase())
  );
  return (
    <div>
      <Header />
      <div className="input-wrapper">
        <h1 style={{ margin: "0.2rem" }}>Discover Podcasts</h1>
        <InputComponent
            search={search}
            setState={setSearch}
            placeholder="Start Search By Title"
            type="text"
          />
        {filteredPodcasts.length > 0 ? (
          <div className="podcasts-flex">
            {filteredPodcasts.map((podcast) => {
              return (
                <Podcastcard
                  key={podcast.id}
                  id={podcast.id}
                  title={podcast.title}
                  displayImage={podcast.displayImage}
                  createdBy={podcast.createdBy}
                />
              );
            })}            
          </div>
        ) : (
          <p>
            {search ? "Podcast Not Found" : <PodcastShimmer/>}
          </p>
        )}
      </div>
    </div>
  );
}

export default Podcasts;
