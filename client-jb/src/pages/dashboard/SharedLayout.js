import { Outlet } from "react-router-dom";
import Wrapper from "../../assets/wrappers/SharedLayout";
import MainMenu from "../../components/MainMenu";

const SharedLayout = () => {
  return (
    <Wrapper>
      <main className="dashboard">
        <MainMenu position="absolute"></MainMenu> 
        <div margin-top="-100px">
          {/* <Navbar /> */}
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default SharedLayout;
