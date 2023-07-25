import { useAppContext } from "../context/appContext";
import NavLinks from "./NavLinks";
import Logo from "../components/Logo";
import Wrapper from "../assets/wrappers/BigSidebar";
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";
import { Button } from "react-bootstrap";

const BigSidebar = () => {
  const { showSidebar, toggleSidebar, logoutUser } = useAppContext();

  return (
    <Wrapper>
      <div
        // print show sidebar below
        className={showSidebar ? "sidebar-container" : "show-sidebar"}
      >
        <div className="content">
          <header>
            <Logo width={175} height={75} />
            <button className="menuBtn" onClick={toggleSidebar}>
              {showSidebar ? (
                <KeyboardDoubleArrowRight />
              ) : (
                <KeyboardDoubleArrowLeft />
              )}
            </button>
          </header>
          <NavLinks />
          <div className="logout-container">
            <Button
              variant="dark"
              className="rounded-circle"
              onClick={logoutUser}
              style={{
                display: "flex",
                width: "70px",
                height: "70px",
                borderRadius: "80%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
