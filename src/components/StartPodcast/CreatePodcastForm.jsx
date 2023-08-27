import React, { useState } from "react";
import InputComponent from "../common/Input";
import { toast } from "react-toastify";
import Button from "../common/Button";
import FileInput from "../common/Input/FileInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CreatePodcastForm() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [displayImage, setDisplayImage] = useState();
  const [bannerImage, setBannerImage] = useState();
  const [loading, setLoading] = useState(false);
  const [isSubmitted,setIsSubmitted]=useState(false);
  const navigate = useNavigate()
  const handleCreate = async () => {
    if (title && desc && displayImage && bannerImage) {
      setLoading(true);
      try {
        const bannerImageRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(bannerImageRef, bannerImage);
        const bannerImageUrl = await getDownloadURL(bannerImageRef);

        const displayImageRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(displayImageRef, displayImage);

        const displayImageUrl = await getDownloadURL(displayImageRef);
        const podcastData = {
          title: title,
          description: desc,
          bannerImage: bannerImageUrl,
          displayImage: displayImageUrl,
          createdBy: auth.currentUser.uid,
        };
        const docRef = await addDoc(collection(db, "podcasts"), podcastData);

        //Redirect to the podcast details Page
        setTitle("");
        setDesc("");
        setBannerImage(null);
        setDisplayImage(null);
        setIsSubmitted(true);
        navigate("/podcasts");
        toast.success("Podcast Created");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      toast.error("All fields Required!");
      setLoading(false);
    }
  };
  const displayImageHandle = (file) => {
    setDisplayImage(file);
  };
  const bannerImageHandle = (file) => {
    setBannerImage(file);
  };
  return (
    <>
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
        accept={"image/*"}
        id="display-img-input"
        text="Upload Display Image"
        fileHandle={displayImageHandle}
        isSubmitted={isSubmitted}
      />
      <FileInput
        accept={"image/*"}
        id="banner-img-input"
        text="Upload Banner Image"
        fileHandle={bannerImageHandle}
        isSubmitted={isSubmitted}
      />
      <Button
        text={loading ? "Loading.." : "Create"}
        disabled={loading}
        onClick={handleCreate}
      />
    </>
  );
}

export default CreatePodcastForm;
