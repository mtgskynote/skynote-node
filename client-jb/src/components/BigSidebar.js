import { useAppContext } from "../context/appContext";
import NavLinks from "./NavLinks";
import Logo from "../components/Logo";
import Wrapper from "../assets/wrappers/BigSidebar";
import {
  KeyboardDoubleArrowLeft,
  KeyboardDoubleArrowRight,
} from "@mui/icons-material";

const BigSidebar = () => {
  const { showSidebar, toggleSidebar } = useAppContext();
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
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
