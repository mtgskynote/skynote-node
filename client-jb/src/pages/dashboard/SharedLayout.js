import { Outlet } from "react-router-dom";
import MainMenu from "../../components/MainMenu";
import SharedLayoutCSS from "./SharedLayout.module.css"

const SharedLayout = () => {
  return (
    <main className={SharedLayoutCSS.dashboard}>
      <MainMenu ></MainMenu> 
      {/* <Navbar /> */}
      <div className={SharedLayoutCSS.dashboardPage}>
        <Outlet />
      </div>
    </main>
  );
};

export default SharedLayout;
