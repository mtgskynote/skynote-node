import white_logo from "../assets/images/white_logo.png";

const WhiteLogo = ({ height, width }) => {
    return (
      <img
        src={white_logo}
        className="white-logo"
        altprop="white-logo"
        style={{width:'35%',height:'300%'}}
      />
    );
  };
  
  export default WhiteLogo;