import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { useNavigate, useParams } from "react-router-dom";
import { collection, doc, getDoc, query } from "firebase/firestore";
import { db, auth } from "../firebase";
import { toast } from "react-toastify";
import Button from "../components/common/Button";
import { onSnapshot } from "firebase/firestore";
import EpisodeDetails from "../components/Podcasts/EpisodeDetails";
import AudioPlayer from "../components/Podcasts/AudioPlayer";

function PodcastDetails() {
  const { id } = useParams();
  const [podcast, setPodcast] = useState({});
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState([]);
  const [playingFile, setPlayingFile] = useState("");
  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);
  const getData = async () => {
    try {
      const docRef = doc(db, "podcasts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setPodcast({
          id: id,
          ...docSnap.data(),
        });
      } else {
        console.log("No such doc");
        toast.error("No such Podcast");
        navigate("/podcasts");
      }
    } catch (e) {
      toast.error(e.message);
    }
  };
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts", id, "episodes")),
      (querySnapshot) => {
        const episodesData = [];
        querySnapshot.forEach((doc) => {
          episodesData.push({ id: doc.id, ...doc.data() });
        });
        setEpisodes(episodesData);
      },
      (error) => {
        console.error("Error fetching episodes:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [id]);

  return (
    <div>
      <Header />
      <div className="wrapper">
        <></>
        {podcast.id && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: "1rem",
              }}
            >
              <h1 style={{ textAlign: "left" }}>{podcast.title}</h1>
              {podcast.createdBy == auth.currentUser.uid && (
                <Button
                  width={"120px"}
                  text={"Create Episode"}
                  onClick={() => {
                    navigate(`/podcast/${id}/create-episode`);
                  }}
                  bgcolor={"#171114"}
                  textcolor={"#d7d7d7"}
                />
              )}
            </div>

            <div className="banner-wrapper">
              <img src={podcast.bannerImage} />
            </div>
            <p className="podcast-desc">{podcast.description}</p>
            <h1 style={{ marginTop: "2rem" }}>Episodes:</h1>
            {episodes.length > 0 ? (
              <>
                {episodes.map((episode, index) => {
                  return (
                    <EpisodeDetails
                      key={index}
                      index={index + 1}
                      title={episode.title}
                      description={episode.description}
                      audioFile={episode.audioFile}
                      onClick={(file) => setPlayingFile(file)}
                    />
                  );
                })}
              </>
            ) : (
              <p style={{ marginLeft: "1.5rem" }}>No Episodes</p>
            )}
          </>
        )}
      </div>
      {playingFile && (
        <AudioPlayer audioSrc={playingFile} image={podcast.displayImage} />
      )}
    </div>
  );
}

export default PodcastDetails;
