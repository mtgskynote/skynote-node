import logo from "../assets/images/new_logo_2023.jpg";

// const Logo = () => {
//   return (
//     <img src={logo} alt="skynote" className="logo"/>
//   );
// };

const Logo = ({ height, width }) => {
  return (<img src= {logo} className="logo" height={height} width={width}/>);
};

export default Logo;
