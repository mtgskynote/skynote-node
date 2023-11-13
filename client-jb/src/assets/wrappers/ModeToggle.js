import styled from "styled-components";

const Wrapper = styled.section`

    .modeToggleDiv {
    background-color: #D3D3D3;
    justify-content: center;
    bottom: 20px;
    position: fixed;
    left: 70%;
    transform: translateX(-50%);
    width: fit-content;
    border-radius: 20px;
    
    }

    .toggleBtn {
    color: black;
    border-radius: 20px;
    font-size: 1.2rem;
    }

    .toggleBtn[title="PracticeModeON"] {
    color: black;
    background-color:lightblue;
    }

    .toggleBtn[title="RecordModeON"] {
        color: black;
        background-color:#A3CD8F;
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
