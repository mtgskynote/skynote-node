import { Logo } from "../components"; // Named export
import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/Testing";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      {/*info*/}
      <div className="container page">
        <div className="info">
          <h1>
            Violin <span> Learning </span> App
          </h1>
          <p>
            It is an intelligent music learning app based on sound and motion
            real-time analysis, and artificial intelligence technology.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img src={main} alt="look-ahead" className="img-main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
