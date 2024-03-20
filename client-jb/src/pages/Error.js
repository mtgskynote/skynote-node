import { Link } from "react-router-dom";
import img from "../assets/images/not-found.svg";
import errorCSS from "./Error.module.css"

const Error = () => {
  return (
      <div className={errorCSS.fullPage}>
        <img className={errorCSS.img} src={img} alt="not found" />
        <h3>Ohh! Page Not Found!</h3>
        <p>We can't seem to find the page you are looking for.</p>
        <Link to="/">back home</Link>
      </div>
  );
};

export default Error;
