import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import MessageCSS from './Message.module.css';

const Message = (props) => {
  const [message, setMessage] = useState('false');

  useEffect(() => {
    setMessage(props.message);
  }, [props]);

  const Message = (
    <div className={MessageCSS.simpleMessage}>
      <p>{message}</p>
    </div>
  );

  return Message;
};

Message.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Message;
