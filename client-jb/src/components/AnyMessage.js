import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import AnyMessageCSS from './AnyMessage.module.css'

const Message = (props) => {
  const [message, setMessage] = useState('false')

  useEffect(() => {
    setMessage(props.message)
  }, [props])

  const Message = (
    <div className={AnyMessageCSS.simpleMessage}>
      <p>{message}</p>
    </div>
  )

  return Message
}

Message.propTypes = {
  message: PropTypes.string.isRequired
}

export default Message
