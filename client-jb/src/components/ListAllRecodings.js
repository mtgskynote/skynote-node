// ListAllRecordings.js
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ListAllRecordingsCSS from './ListRecordings.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  getAllRecData,
  deleteRecording,
} from '../utils/studentRecordingMethods.js'
import { useAppContext } from '../context/appContext'
import PopUpWindowEdit from './PopUpWindowEdit.js'

import {
  faTrash,
  faEye,
  faStar,
  faPencilSquare,
  faBoxArchive,
  faMusic,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons'

const ListAllRecordings = () => {
  const { getCurrentUser } = useAppContext()
  const [userData, setUserData] = useState(null)
  const [localData, setLocalData] = useState(null)
  const [recordingList, setRecordingList] = useState(null)
  const [recordingNames, setRecordingNames] = useState(null)
  const [recordingStars, setRecordingStars] = useState(null)
  const [recordingScores, setRecordingScores] = useState(null)
  const [recordingDates, setRecordingDates] = useState(null)
  const [recordingSkills, setRecordingSkills] = useState(null)
  const [recordingLevels, setRecordingLevels] = useState(null)
  const [idSelectedEdit, setIdSelectedEdit] = useState(null)
  const [showPopUpEdit, setShowPopUpEdit] = useState(false)
  const navigate = useNavigate()
  // Define options for formatting date
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }

  // Starting --> load recordings from userID and scoreID
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('scoreData'))
    setLocalData(local)

    const fetchDataFromAPI = () => {
      if (userData === null) {
        getCurrentUser() // fetchData is already an async function
          .then((result) => {
            setUserData(result)
          })
          .catch((error) => {
            console.log(`getCurrentUser() error: ${error}`)
          })
      }

      if (userData !== null && recordingList === null) {
        getAllRecData(userData.id)
          .then((result) => {
            setRecordingList(result)
            setRecordingNames(
              result.map((recording) => recording.recordingName)
            )
            setRecordingStars(
              result.map((recording) => recording.recordingStars)
            )
            setRecordingDates(
              result.map((recording) => {
                //Set correct date format
                const recordingDate = new Date(recording.recordingDate)
                return recordingDate.toLocaleDateString('es-ES', options)
              })
            )
            setRecordingLevels(
              result.map((recording) => {
                return local.find((item) => item._id === recording.scoreID)
                  .level
              })
            )
            setRecordingSkills(
              result.map((recording) => {
                return local.find((item) => item._id === recording.scoreID)
                  .skill
              })
            )
            setRecordingScores(
              result.map((recording) => {
                return local.find((item) => item._id === recording.scoreID)
                  .title
              })
            )
          })
          .catch((error) => {
            console.log(`Cannot get recordings from database: ${error}`)
          })
      }
    }

    fetchDataFromAPI()
    // eslint-disable-next-line
  }, [userData, recordingList, getCurrentUser])

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Event handler for going back
  const handleGoBack = () => {
    // Use navigate to go back to the previous page
    //navigate(-1);
    navigate(`/`)
  }

  // Event handler for click on See
  const handleSeeClick = (index) => {
    const recording = recordingList[index]
    const scoreName = recordingScores[index]
    const scoreXML = localData.find((item) => item.title === scoreName).fname
    navigate(`/ListRecordings/${scoreXML}`, {
      state: { id: recording.recordingId },
    })
  }

  // Event handler for click on Edit
  const handleEditClick = (action, nameOfFile) => {
    if (action === 'open') {
      const id =
        JSON.parse(recordingList)[recordingNames.indexOf(nameOfFile)]
          .recordingId
      //Store id to edit so that popupwindow can access it
      setIdSelectedEdit(id)
      // Show pop up window component
      setShowPopUpEdit(true)
    } else {
      // Dont show pop up window component
      setShowPopUpEdit(false)
      //Delete stored id
      setIdSelectedEdit(null)
    }
  }

  // Event handler for click on Trash
  const handleTrashClick = (nameOfFile, index) => {
    if (recordingNames.indexOf(nameOfFile) !== -1) {
      const idToDelete =
        recordingList[recordingNames.indexOf(nameOfFile)].recordingId
      // Delete recording entry of state arrays
      const auxArrayNames = recordingNames.filter(
        (item, index) => index !== recordingNames.indexOf(nameOfFile)
      )
      const auxArrayList = recordingList.filter(
        (item, index) => index !== recordingNames.indexOf(nameOfFile)
      )
      const auxRecordingStars = recordingStars.filter(
        (item, index) => index !== recordingNames.indexOf(nameOfFile)
      )
      const auxRecordingScores = recordingScores.filter(
        (item, index) => index !== recordingNames.indexOf(nameOfFile)
      )
      const auxRecordingDates = recordingDates.filter(
        (item, index) => index !== recordingNames.indexOf(nameOfFile)
      )
      const auxRecordingSkills = recordingSkills.filter(
        (item, index) => index !== recordingNames.indexOf(nameOfFile)
      )
      const auxRecordingLevels = recordingLevels.filter(
        (item, index) => index !== recordingNames.indexOf(nameOfFile)
      )
      // Delete recording from database
      deleteRecording(idToDelete)
        .then(() => {
          setRecordingNames(auxArrayNames)
          setRecordingList(auxArrayList)
          setRecordingStars(auxRecordingStars)
          setRecordingScores(auxRecordingScores)
          setRecordingDates(auxRecordingDates)
          setRecordingSkills(auxRecordingSkills)
          setRecordingLevels(auxRecordingLevels)
        })
        .catch((error) => {
          console.log(`Cannot delete recordings from database: ${error}`)
        })
    }
  }

  if (recordingNames === null) {
    return <p>Loading...</p>
  }

  // Your component logic using the variables
  return (
    <div className={ListAllRecordingsCSS.container}>
      <div>
        <h2>All recordings...</h2>
      </div>

      {/* List of songs */}
      {recordingNames.length !== 0 ? (
        <div className={ListAllRecordingsCSS.songlist2}>
          {recordingNames.map((nameOfFile, index) => (
            //Each element/recording
            <div className={ListAllRecordingsCSS.songelement2} key={index}>
              <li key={index}>
                <div className={ListAllRecordingsCSS.recTitle}>
                  <h5>
                    {nameOfFile}{' '}
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className={ListAllRecordingsCSS.iconModify}
                      onClick={() => handleEditClick('open', nameOfFile)}
                    />{' '}
                  </h5>
                </div>
                <div className={ListAllRecordingsCSS.starsGroup}>
                  <FontAwesomeIcon
                    icon={faStar}
                    className={
                      recordingStars[index] >= 1
                        ? ListAllRecordingsCSS.completeStar
                        : ListAllRecordingsCSS.incompleteStar
                    }
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    className={
                      recordingStars[index] >= 2
                        ? ListAllRecordingsCSS.completeStar
                        : ListAllRecordingsCSS.incompleteStar
                    }
                  />
                  <FontAwesomeIcon
                    icon={faStar}
                    className={
                      recordingStars[index] >= 3
                        ? ListAllRecordingsCSS.completeStar
                        : ListAllRecordingsCSS.incompleteStar
                    }
                  />
                </div>
                <div className={ListAllRecordingsCSS.textGroup}>
                  <div>
                    <h6>
                      <FontAwesomeIcon
                        icon={faMusic}
                        className={ListAllRecordingsCSS.auxIcon}
                      />
                      {recordingScores[index]}
                    </h6>
                  </div>
                  <div>
                    <h6>
                      <FontAwesomeIcon
                        icon={faPencilSquare}
                        className={ListAllRecordingsCSS.auxIcon}
                      />
                      {recordingSkills[index]}
                    </h6>
                  </div>
                  <div>
                    <h6>
                      <FontAwesomeIcon
                        icon={faBoxArchive}
                        className={ListAllRecordingsCSS.auxIcon}
                      />
                      Level {recordingLevels[index]}
                    </h6>
                  </div>
                </div>

                <div className={ListAllRecordingsCSS.dateTime}>
                  <i>{recordingDates[index]}</i>
                </div>
                <div className={ListAllRecordingsCSS.buttonGroup}>
                  <button
                    className={ListAllRecordingsCSS.iconbutton}
                    onClick={() => handleSeeClick(index)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className={ListAllRecordingsCSS.iconbutton}
                    onClick={() => handleTrashClick(nameOfFile, index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </li>
            </div>
          ))}
        </div>
      ) : (
        <div> No recordings yet</div>
      )}

      {/* Button to go back */}
      <button
        className={ListAllRecordingsCSS.backbutton}
        onClick={handleGoBack}
      >
        Back
      </button>

      {showPopUpEdit ? (
        <PopUpWindowEdit
          idEdit={idSelectedEdit}
          handlerBack={handleEditClick}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default ListAllRecordings
