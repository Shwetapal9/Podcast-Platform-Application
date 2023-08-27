import React, { useEffect, useRef, useState } from "react";
import {  FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { AiFillPauseCircle,AiFillPlayCircle,AiOutlineRightCircle,AiOutlineLeftCircle } from "react-icons/ai";
import { FaCircleLeft,FaCircleRight } from "react-icons/fa6";
import "./styles.css";
function AudioPlayer({ audioSrc, image }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState(1);
  const audioRef = useRef();
  const handleDuration = (e) => {
    setCurrentTime(e.target.value);
    audioRef.current.currentTime = e.target.value;
  };
  const handleVolume = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
  };
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };
  const toggleMute = () => {
    if (isMute) {
      setIsMute(false);
    } else {
      setIsMute(true);
    }
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };
  useEffect(() => {}, [audioRef]);
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isMute) {
      audioRef.current.volume = 1;
      setVolume(1);
    } else {
      audioRef.current.volume = 0;
      setVolume(0);
    }
  }, [isMute]);

  //Skip Prev 10seconds
  const handleSkipPrev=()=>{
    const newCurrentTime = currentTime-10
    setCurrentTime(newCurrentTime);
    audioRef.current.currentTime = newCurrentTime;
  }
  //Skip Next 10seconds
  const handleSkipNext=()=>{
    const newCurrentTime = currentTime+10
    setCurrentTime(newCurrentTime);
    audioRef.current.currentTime = newCurrentTime;
  }
  return (
    <div className="custom-audio-player">      
      <img src={image} className="display-image-player" />     
      <audio ref={audioRef} src={audioSrc} />
      <div className="custom-duration">
        <p className="duration">{formatTime(currentTime)}</p>
        <p className="SkipPrev" value={currentTime} onClick={handleSkipPrev} ><AiOutlineLeftCircle/></p>
        <p onClick={togglePlay} className="custom-icons">{isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}</p>
        <p className="SkipNext" value={currentTime} onClick={handleSkipNext}><AiOutlineRightCircle/></p>
        <input
          type="range"
          max={duration}
          value={currentTime}
          onChange={handleDuration}
          step={0.01}
          className="duration-range"
        />
        <p className="duration">-{formatTime(duration - currentTime)}</p>
        <p onClick={toggleMute}>
          {!isMute ? <FaVolumeUp /> : <FaVolumeMute />}
        </p>
        <input
          type="range"
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={handleVolume}
          className="volume-range"
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
