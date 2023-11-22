import links from "../utils/links";
import { NavLink } from "react-router-dom";

const MainMenu = () => {
  return (
    <div class="dropdown">
      <input type="checkbox" id="dropdown-toggle" class="dropdown-toggle"></input>
      <label class="dropbtn" for="dropdown-toggle">Menu</label>
      <div class="dropdown-content">
        
      <div className="nav-links">
      {links.map((link) => {
        const { text, path, id, icon } = link;

        return (
          <NavLink
            to={path}
            key={id}

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


      </div>
    </div>
  )
};

export default MainMenu;