import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo, FormRow, Alert } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../context/appContext";
import { Link } from "react-router-dom";
import WhiteLogo from "../components/WhiteLogo";
import "bootstrap/dist/css/bootstrap.min.css";

// import { useGoogleLogin } from "@react-oauth/google";
// import { useDispatch } from "react-redux";

// global context and useNavigate later

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};
// if possible prefer local state
// global state

function Register() {
  const [values, setValues] = useState(initialState);
  const navigate = useNavigate();

  const { user, isLoading, showAlert, displayAlert, setupUser } =
    useAppContext();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };
  // global context and useNavigate later

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password };

    if (isMember) {
      setupUser({
        currentUser,
        endPoint: "login",
        alertText: "Login Successful! Redirecting...",
      });
    } else {
      setupUser({
        currentUser,
        endPoint: "register",
        alertText: "User Created! Redirecting...",
      });
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">

      <form className="form" onSubmit={onSubmit}>
        <Logo width={175} height={75}/>
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}

        {/* name field */}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
        )}

        {/* email field */}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />

        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? "Not a Member yet?" : "Already a Member?"}
          {/* <button type="button" onClick={toggleMember} className="member-btn"> */}
          <button type="button" className="member-btn">
            {values.isMember ? "We're sorry, new registrations are temporarily disabled " : "Login"}
          </button>
        </p>
        <div className="g-signin2" data-onsuccess="onSignIn">
          <button
            type="button"
            onClick={() => "login()"}
            className="google-btn"
          >
            <i className="fa-brands fa-google btn"></i> Sign up with google
          </button>
        </div>
      </form>
    </Wrapper>
  );
}


export default Register;
