import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBackwardFast,
  faPlay,
  faRecordVinyl,
  faVolumeHigh,
  faGauge,
  faBoltLightning,
  faMousePointer,
  faICursor,
} from "@fortawesome/free-solid-svg-icons";

const useControlBar = (cursorRef) => {
  const titles = [
    "cursorShow",
    "cursorHide",
    "search",
    "beginning",
    "play",
    "record",
    "volume",
    "tempo",
    "visualize",
  ];
  const icons = [
    faICursor,
    faMousePointer,
    faMagnifyingGlass,
    faBackwardFast,
    faPlay,
    faRecordVinyl,
    faVolumeHigh,
    faGauge,
    faBoltLightning,
  ];

  useEffect(() => {
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      button.addEventListener("mousedown", () => {
        console.log(`${button.getAttribute("title")} button was clicked.`);
        if (button.getAttribute("title") === "cursorShow") {
          cursorRef.current.show();
        } else if (button.getAttribute("title") === "cursorHide") {
          cursorRef.current.hide();
          // console.log(cursorRef.current);
        }
      });
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("mousedown", () => {
          console.log(`${button.getAttribute("title")} button was clicked.`);
          if (button.getAttribute("title") === "cursorShow") {
            cursorRef.current.show();
          }
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
        alignItems: "center",
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
