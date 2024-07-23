///////////////////////////////////////////
////////// THIS FILE IS OBSOLETE //////////
///////////////////////////////////////////
import styled from 'styled-components';

const Wrapper = styled.section`
  .completeModeDiv {
    display: flex;
    align-items: center;
    /* Add any other styles or sizing properties if needed */
  }

  .InfoMode {
    justify-content: center;

    position: fixed;
    left: 90%;
    top: 5%;
  }
  .message {
    background-color: #ffffff;
    justify-content: center;

    position: fixed;
    left: 90%;
    top: 15%;
    transform: translateX(-50%);
    width: fit-content;
    border-radius: 10px;
    padding: 10px;
    border: 2px solid #333;
  }

  .modeToggleDiv {
    background-color: #d3d3d3;
    justify-content: center;

    position: fixed;
    left: 84%;
    top: 5%;
    transform: translateX(-50%);
    width: fit-content;
    border-radius: 20px;
  }

  .toggleBtn {
    color: black;
    border-radius: 20px;
    font-size: 1.2rem;
  }

  .toggleBtn[title='PracticeModeON'] {
    color: black;
    background-color: lightblue;
  }

  .toggleBtn[title='RecordModeON'] {
    color: black;
    background-color: #a3cd8f;
  }

  .toggleBtn[title='VisualMode'] {
    color: black;
    background-color: #dde172;
    margin: 0px 5px;
  }

  .dropDownTgl {
    color: black;
    margin: 0;
    border-radius: 20px;
    background-color: lightblue;
  }

  /* > div  {
        display: "block";
        margin: "0 auto";
        background-color: "lightblue";
        justify-content: "center";
        bottom: 20;
        position: "fixed";
        left: "50%"; // Adjust the horizontal position as needed
        transform: "translateX(-50%)"; // To horizontally center the bar
        width: "max-content";
        border-radius: "20px";
      } */
`;
export default Wrapper;
