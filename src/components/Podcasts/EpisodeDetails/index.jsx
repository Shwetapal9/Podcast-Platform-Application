import React from "react";
import Button from "../../common/Button";

function EpisodeDetails({ index, title, description, audioFile, onClick }) {
  return (
    <div>
      <h2 style={{ textAlign: "left", marginBottom: "0", marginLeft: "1rem" }}>
        {index}.{title}
      </h2>
      <p style={{ marginLeft: "1.5rem" }} className="podcast-desc">
        {description}
      </p>
      <Button
        text={"Play"}
        onClick={() => onClick(audioFile)}
        width={"100px"}
        marginleft={"2.6rem"}
        bgcolor={"#171114"}
        textcolor={"#d7d7d7"}
      />
    </div>
  );
}

export default EpisodeDetails;
