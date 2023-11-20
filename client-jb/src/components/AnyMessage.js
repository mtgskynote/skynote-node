import {useEffect, useState } from "react";

const Message = (props) => {

  const [message, setMessage] = useState("false");

  useEffect(() => {
    setMessage(props.message)
  }, [props]);

  const messageStyle = {
    backgroundColor: "white",
    border: "1px solid black",
    borderRadius: "3px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    padding: "1", // No fixed padding
    margin: "0px",
    width: "fit-content",
    position:"fixed",
  };

  const Message = (
    <div className="simple-message" style={messageStyle}>
        <p>{message}</p>
    </div>             
  );

  return Message;
};

export default Message;
