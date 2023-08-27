import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

function Podcastcard({id, title, displayImage,createdBy}) {
  return (
    <Link to={`/podcast/${id}`}>
      <div className="podcast-card">
        <img className="display-img-podcast" src={displayImage} />
        <div className="pod-desc" >
        <p className="title-podcast">{title}</p>
        <FaPlay/>
        </div>
      </div>      
    </Link>
  );
}

export default Podcastcard;
