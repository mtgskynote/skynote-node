import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faUndoAlt,
  faBackward,
  faPlay,
  faPause,
  faForward,
  faRecordVinyl,
  faVolumeHigh,
  faGauge,
  faMagnifyingGlassPlus,
  faMagnifyingGlassMinus,
  faBoltLightning,
} from "@fortawesome/free-solid-svg-icons";

const useControlBar = (cursorRef) => {
  const titles = [
    "cursorShow",
    "cursorHide",
    "beginning",
    "backward",
    "play",
    "pause",
    "forward",
    "record",
    "volume",
    "metronome",
    "zoomIn",
    "zoomOut",
    "visualize",
  ];
  const icons = [
    faEye,
    faEyeSlash,
    faUndoAlt,
    faBackward,
    faPlay,
    faPause,
    faForward,
    faRecordVinyl,
    faVolumeHigh,
    faGauge,
    faMagnifyingGlassPlus,
    faMagnifyingGlassMinus,
    faBoltLightning,
  ];

  useEffect(() => {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("mousedown", () => {
        console.log(`${button.getAttribute("title")} button was clicked.`);
      });
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("mousedown", () => {
          console.log(`${button.getAttribute("title")} button was clicked.`);
        });
      });
    };
  }, [cursorRef]);

  const controlbar = (
    <div
      style={{
        display: "table",
        margin: "0 auto",
        backgroundColor: "blue",
        justifyContent: "center",
        bottom: 20,
        position: "fixed",
        left: 225,
        right: 0,
        width: "max-content",
        borderRadius: "8px",
      }}
    >
      {titles.map((title, i) => {
        return (
          <button
            key={title}
            style={{
              margin: ".3rem .2rem",
              borderRadius: "5px",
              color: title === "record" ? "red" : undefined,
            }}
            title={title}
            id={title}
          >
            <FontAwesomeIcon icon={icons[i]} />
          </button>
        );
      })}
    </div>
  );

  return controlbar;
};

export { useControlBar };
