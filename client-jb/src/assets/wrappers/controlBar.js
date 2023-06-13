import styled from "styled-components";

const Wrapper = styled.section`

    .myDiv {
    background-color: lightblue;
    justify-content: center;
    bottom: 20px;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    width: fit-content;
    border-radius: 15px;
    }

    .controlBtn {
    color: black;
    margin: 0.3rem 0.2rem;
    border-radius: 20px;
    font-size: 1.2rem;
    }

    .controlBtn[title="record"] {
    color: red;
    }

    .dropDownTgl {
        color: black;
        margin: 0;
        border-radius: 20px;
        background-color: lightblue;
    }

    .play-pause-icon {
        color: var(--primary-500);
    }

    .slider-container {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .slider-label {
    margin-right: 30px;
    font-weight: bold;
    }

    .slider-input {
    width: 200px;
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
