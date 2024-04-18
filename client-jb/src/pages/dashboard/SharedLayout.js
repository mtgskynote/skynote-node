import { Outlet } from "react-router-dom";
import SharedLayoutCSS from "./SharedLayout.module.css"
import Navbar from "../../components/Navbar";

const SharedLayout = () => {
  return (
      <main className={`${SharedLayoutCSS.dashboard} pt-16`}>
        <Navbar />
        <div className={SharedLayoutCSS.dashboardPage}>
          <Outlet />
        </div>
      </main>
  );
};

export default SharedLayout;
