// ListRecordings.js
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ListRecordingsCSS from "./ListRecordings.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getRecData,
  deleteRecording,
} from "../utils/studentRecordingMethods.js";
import { useAppContext } from "../context/appContext";
import {
  faTrash,
  faEye,
  faStar,
  faPencilSquare,
  faBoxArchive,
  faMusic,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import PopUpWindowEdit from "./PopUpWindowEdit.js";
import LoadingScreen from "./LoadingScreen.js";
import RecordingCard from "./RecordingCard.js";

const ListRecordings = () => {
  const { getCurrentUser } = useAppContext();
  const [userData, setUserData] = useState(null);
  const [recordingList, setRecordingList] = useState(null);
  const [recordingNames, setRecordingNames] = useState(null);
  const [recordingStars, setRecordingStars] = useState(null);
  const [recordingDates, setRecordingDates] = useState(null);
  const [recordingIds, setRecordingIds] = useState(null);
  const [scoreSkill, setScoreSkill] = useState(null);
  const [scoreLevel, setScoreLevel] = useState(null);
  const [scoreXml, setScoreXml] = useState(null);
  const [idSelectedEdit, setIdSelectedEdit] = useState(null);
  const [showPopUpEdit, setShowPopUpEdit] = useState(false);

  const [showDeleteBanner, setShowDeleteBanner] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  // Define options for formatting date
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  // Access the passed variables from the location object
  const score = location.state?.score || "DefaultSong";
  const song = location.state?.song || "DefaultSong1";

  // Starting --> load recordings from userID and scoreID
  useEffect(() => {
    const itemFoundLocalStorage = JSON.parse(
      localStorage.getItem("scoreData")
    ).find((item) => item.fname === score);
    const scoreID = itemFoundLocalStorage._id;
    setScoreLevel(itemFoundLocalStorage.level);
    setScoreSkill(itemFoundLocalStorage.skill);
    setScoreXml(itemFoundLocalStorage.fname);
    const fetchDataFromAPI = () => {
      if (userData === null) {
        getCurrentUser() // fetchData is already an async function
          .then((result) => {
            setUserData(result);
          })
          .catch((error) => {
            console.log(`getCurentUser() error: ${error}`);
          });
      }
      if (userData !== null) {
        getRecData(userData.id, scoreID)
          .then((result) => {
            setRecordingList(result);
            setRecordingIds(result.map((recording) => recording.recordingId));
            setRecordingNames(
              result.map((recording) => recording.recordingName)
            );
            setRecordingStars(
              result.map((recording) => recording.recordingStars)
            );
            setRecordingDates(
              result.map((recording) => {
                //Set correct date format
                const recordingDate = new Date(recording.recordingDate);
                return recordingDate.toLocaleDateString("es-ES", options);
              })
            );
          })
          .catch((error) => {
            console.log(`Cannot get recordings from database: ${error}`);
          });
      }
    };

    fetchDataFromAPI();
  }, [userData]);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Event handler for going back
  const handleGoBack = () => {
    // Use navigate to go back to the previous page
    //navigate(-1);
    navigate(`/all-lessons/${score}`);
  };

  // Event handler for click on See
  const handleSeeClick = (nameOfFile, number) => {
    const recording = recordingList[recordingNames.indexOf(nameOfFile)];
    //Pass recording ID to ProgressPlayfileVisual
    navigate(score, { state: { id: recording.recordingId } });
  };

  // Event handler for click on Edit
  const handleEditClick = (action, nameOfFile) => {
    if (action === "open") {
      const id = recordingList[recordingNames.indexOf(nameOfFile)].recordingId;
      //Store id to edit so that popupwindow can access it
      setIdSelectedEdit(id);
      // Show pop up window component
      setShowPopUpEdit(true);
    } else {
      // Dont show pop up window component
      setShowPopUpEdit(false);
      //Delete stored id
      setIdSelectedEdit(null);
    }
  };

  // Handle delete recording by
  const handleDeleteRecording = (recordingName, recordingId) => {
    const index = recordingNames.indexOf(recordingName);
    if (index !== -1) {
      const newRecordingNames = recordingNames.filter((_, i) => i !== index);
      const newRecordingList = recordingList.filter((_, i) => i !== index);
      const newRecordingDates = recordingDates.filter((_, i) => i !== index);
      const newRecordingIds = recordingIds.filter((_, i) => i !== index);
      deleteRecording(recordingId)
        .then(() => {
          setDeleteMessage(`Successfully deleted ${recordingName}.`);
          setShowDeleteBanner(true); // Show delete banner
          setTimeout(() => {
            setShowDeleteBanner(false); // Hide delete banner after 3 seconds
          }, 3000); // Adjust timing as needed
          setRecordingNames(newRecordingNames);
          setRecordingList(newRecordingList);
          setRecordingDates(newRecordingDates);
          setRecordingIds(newRecordingIds);
        })
        .catch((error) => {
          console.log(`Cannot delete recording from database: ${error}`);
          setDeleteMessage(`Could not delete ${recordingName}.`);
          setShowDeleteBanner(true); // Show delete banner
          setTimeout(() => {
            setShowDeleteBanner(false); // Hide delete banner after 3 seconds
          }, 3000); // Adjust timing as needed
        });
    }
  };

  if (recordingNames === null) {
    return <LoadingScreen />;
  }

  // Your component logic using the variables
  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleGoBack}
        className="ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-center text-white text-sm border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-blue-400 hover:bg-blue-500 font-extralight py-1 px-2 rounded-l-none outline-none rounded"
      >
        Go Back
      </button>
      <div className="flex items-center justify-between mt-12">
        {/* Left side: Title */}
        <div className="text-4xl font-bold capitalize">{song}</div>

        {/* Right side: Skill and Level */}
        <div className="text-lg text-gray-600 text-right">
          <div>{scoreSkill}</div>
          <div>Level {scoreLevel}</div>
        </div>
      </div>
      <hr className="h-0.5 border-t-0 bg-gray-700 mb-10" />
      {recordingNames.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recordingNames.map((recordingName, index) => (
            <div key={index} className="flex justify-center">
              <RecordingCard
                recordingName={recordingName}
                stars={recordingStars[index]}
                recordingId={recordingIds[index]}
                xml={scoreXml}
                onDeleteRecording={handleDeleteRecording}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="w-full">No recordings found.</p>
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-green-500 text-white p-3 flex items-center justify-center transition-transform transform ${
          showDeleteBanner ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <p>{deleteMessage}</p>
      </div>
    </div>
    // <div className={ListRecordingsCSS.container}>
    //   <h2>
    //     <FontAwesomeIcon icon={faMusic} className={ListRecordingsCSS.auxIcon} />
    //     {song}
    //     <FontAwesomeIcon icon={faMusic} className={ListRecordingsCSS.auxIcon} />
    //   </h2>
    //   <div className={ListRecordingsCSS.textGroup}>
    //     <div>
    //       <h6>
    //         <FontAwesomeIcon
    //           icon={faPencilSquare}
    //           className={ListRecordingsCSS.auxIcon}
    //         />
    //         {scoreSkill}
    //       </h6>
    //     </div>
    //     <div>
    //       <h6>
    //         <FontAwesomeIcon
    //           icon={faBoxArchive}
    //           className={ListRecordingsCSS.auxIcon}
    //         />
    //         Level {scoreLevel}
    //       </h6>
    //     </div>
    //   </div>

    //   {/* List of songs */}
    //   {recordingNames.length !== 0 ? (
    //     <div className={ListRecordingsCSS.songlist}>
    //       {recordingNames.map((nameOfFile, index) => (
    //         <div className={ListRecordingsCSS.songelement} key={index}>
    //           <li key={index}>
    //             <div className={ListRecordingsCSS.recTitle}>
    //               <h5>
    //                 {nameOfFile}{" "}
    //                 <FontAwesomeIcon
    //                   icon={faPenToSquare}
    //                   className={ListRecordingsCSS.iconModify}
    //                   onClick={() => handleEditClick("open", nameOfFile)}
    //                 />{" "}
    //               </h5>
    //             </div>
    //             <div className={ListRecordingsCSS.starsGroup}>
    //               <FontAwesomeIcon
    //                 icon={faStar}
    //                 className={
    //                   recordingStars[index] >= 1
    //                     ? ListRecordingsCSS.completeStar
    //                     : ListRecordingsCSS.incompleteStar
    //                 }
    //               />
    //               <FontAwesomeIcon
    //                 icon={faStar}
    //                 className={
    //                   recordingStars[index] >= 2
    //                     ? ListRecordingsCSS.completeStar
    //                     : ListRecordingsCSS.incompleteStar
    //                 }
    //               />
    //               <FontAwesomeIcon
    //                 icon={faStar}
    //                 className={
    //                   recordingStars[index] >= 3
    //                     ? ListRecordingsCSS.completeStar
    //                     : ListRecordingsCSS.incompleteStar
    //                 }
    //               />
    //             </div>
    //             <div>
    //               <button
    //                 className={ListRecordingsCSS.iconbutton}
    //                 onClick={() => handleSeeClick(nameOfFile, index)}
    //               >
    //                 <FontAwesomeIcon icon={faEye} />
    //               </button>
    //               <button
    //                 className={ListRecordingsCSS.iconbutton}
    //                 onClick={() => handleTrashClick(nameOfFile, index)}
    //               >
    //                 <FontAwesomeIcon icon={faTrash} />
    //               </button>
    //             </div>
    //             <div className={ListRecordingsCSS.dateTime}>
    //               <i>{recordingDates[index]}</i>
    //             </div>
    //           </li>
    //         </div>
    //       ))}
    //     </div>
    //   ) : (
    //     <div> No recordings for this score</div>
    //   )}

    //   {/* Button to go back */}
    //   <button className={ListRecordingsCSS.backbutton} onClick={handleGoBack}>
    //     Back
    //   </button>
    //   {showPopUpEdit ? (
    //     <PopUpWindowEdit
    //       idEdit={idSelectedEdit}
    //       handlerBack={handleEditClick}
    //     />
    //   ) : (
    //     ""
    //   )}
    // </div>
  );
};

export default ListRecordings;
