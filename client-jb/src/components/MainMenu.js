import links from "../utils/links";
import { NavLink } from "react-router-dom";
import MainMenuCSS from './MainMenu.module.css';
import { useAppContext } from "../context/appContext";
import { Button } from "react-bootstrap";

const MainMenu = () => {
  const { logoutUser } = useAppContext();

  //If user clicks anywhere outside the menu, close menu
  const handleOutsideClick = (event) => {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownContent = document.getElementById('dropdown-content');
    if (
      dropdownToggle &&
      dropdownContent &&
      !dropdownToggle.contains(event.target) &&
      !dropdownContent.contains(event.target) && dropdownToggle.checked===true
    ) {
      dropdownToggle.checked = false;
    }
  };

  document.addEventListener('click', handleOutsideClick);

  return (
    <div className={MainMenuCSS.dropdown} position="absolute"> 
      <input type="checkbox" id="dropdown-toggle" className={MainMenuCSS.dropdown_toggle}></input>
      <label className={MainMenuCSS.dropbtn} for="dropdown-toggle">Menu</label>
      <div className={MainMenuCSS.dropdown_content}>

      <div className="nav-links" id="dropdown-content">
      {links.map((link) => {
        const { text, path, id, icon } = link;

        return (
          <NavLink
            to={path}
            key={id}
            onClick={() => {
              console.log("clicked");
              document.getElementById("dropdown-toggle").checked = false;
            }}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            end
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
    <Button
      variant="outline-primary"
      onClick={logoutUser}
      style={{
        display: "flex",
        width: "70px",
        height: "30px",
        borderRadius: "10%",
        justifyContent: "center",
        alignItems: "center",
        float: "right",
      }}
    >
      Logout
    </Button>


      </div>
    </div>
  )
};

export default MainMenu;