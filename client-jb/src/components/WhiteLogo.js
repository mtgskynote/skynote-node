import new_logo_2023 from "../assets/images/new_logo_2023.jpg";

const WhiteLogo = ({ height, width }) => {
    return (
      <img
        src={new_logo_2023}
        className="new_logo_2023"
        alt="new_logo_2023"
        style={{width:'35%',height:'300%'}}
      />
    );
  };
  
  export default WhiteLogo;