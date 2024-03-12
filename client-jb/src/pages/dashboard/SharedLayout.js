import { Outlet } from "react-router-dom";
import Wrapper from "../../assets/wrappers/SharedLayout";
import MainMenu from "../../components/MainMenu";

const SharedLayout = () => {
  return (
    <Wrapper>
      <main className="dashboard">
        <MainMenu ></MainMenu> 
        {/* <Navbar /> */}
        <div className="dashboard-page">
          <Outlet />
        </div>
      </main>
    </Wrapper>
  );
};

export default SharedLayout;
