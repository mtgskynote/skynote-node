import React, { useEffect, useRef, useState } from 'react'
import PopUpWindowCSS from './PopUpWindow.module.css'
import { editRecording } from '../utils/studentRecordingMethods.js'

const PopUpWindowEdit = (props) => {
  const [idEdit, setIdEdit] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const userInputRef = useRef()

  useEffect(() => {
    if (props.idEdit !== null && props.idEdit !== undefined) {
      setIdEdit(props.idEdit)
    }
  }, [props])

  const handleUpdate = () => {
    // Update database
    const userInputValue = userInputRef.current.value
    console.log('User Input:', userInputValue)
    if (userInputValue !== '') {
      editRecording(idEdit, userInputValue).then(() => {
        setShowWarning(false)
        // Close/tell to hide the window
        props.handlerBack('close')
        // reload to update
        window.location.reload()
      })
    } else {
      setShowWarning(true)
    }
  }

  const handleCancel = () => {
    console.log('Cancel edit')
    // Close/tell to hide the window
    props.handlerBack('close')
  }

  return (
    <div className={PopUpWindowCSS.popUpWindowEdit}>
      <div className={PopUpWindowCSS.contentEdit}>
        <p>Introduce new name...</p>
        <textarea
          type="text"
          ref={userInputRef}
          id="userInput"
          placeholder="Type name..."
          className={PopUpWindowCSS.textEdit}
        />
        <button className={PopUpWindowCSS.buttonEdit} onClick={handleUpdate}>
          Update
        </button>
        <button className={PopUpWindowCSS.buttonEdit} onClick={handleCancel}>
          Cancel
        </button>
      </div>
      {showWarning ? (
        <div className={PopUpWindowCSS.warning}>
          Introduce a valid name or click cancel
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default PopUpWindowEdit
