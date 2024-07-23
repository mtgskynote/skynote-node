import React, { useEffect, useState } from 'react';
import AnyMessageCSS from './AnyMessage.module.css';

const Message = (props) => {
  const [message, setMessage] = useState('false');

  useEffect(() => {
    setMessage(props.message);
  }, [props]);

  const Message = (
    <div className={AnyMessageCSS.simpleMessage}>
      <p>{message}</p>
    </div>
  );

  return Message;
};

export default Message;
