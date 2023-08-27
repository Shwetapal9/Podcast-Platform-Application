import React, { useState } from "react";
import Header from "../components/common/Header";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponent from "../components/common/Input";
import FileInput from "../components/common/Input/FileInput";
import Button from "../components/common/Button";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { db, auth, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

function CreateEpisode() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [audioFile, setAudioFile] = useState();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const audioFileHandle = (file) => {
    setAudioFile(file);
  };
  const handleSubmit = async () => {
    setLoading(true);
    if ((title, desc, audioFile, id)) {
      try {
        const audioRef = ref(
          storage,
          `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(audioRef, audioFile);

        const audioURL = await getDownloadURL(audioRef);
        const episodeData = {
          title: title,
          description: desc,
          audioFile: audioURL,
        };
        await addDoc(collection(db, "podcasts", id, "episodes"), episodeData);
        toast.success("Episode Created Successfully");
        setLoading(false);
        navigate(`/podcast/${id}`);
        setTitle("");
        setDesc("");
        setAudioFile("");
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      toast.error("All Files Should Be There");
      setLoading(false);
    }
  };
  return (
    <div>
      <Header />
      <div className="input-wrapper">
        <h1>Create An Episode</h1>
        <InputComponent
          state={title}
          setState={setTitle}
          placeholder="Title"
          type="text"
          required="true"
        />
        <InputComponent
          state={desc}
          setState={setDesc}
          placeholder="Description"
          type="text"
          required="true"
        />
        <FileInput
          accept={"audio/*"}
          id="audio-file-input"
          text="Upload Audio File"
          fileHandle={audioFileHandle}
        />
        <Button
          text={loading ? "Loading.." : "Create Episode"}
          disabled={loading}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
}

export default CreateEpisode;
