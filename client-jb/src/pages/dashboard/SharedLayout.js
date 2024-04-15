import { Outlet } from "react-router-dom";
import Wrapper from "../../assets/wrappers/SharedLayout";
import Navbar from "../../components/Navbar";

const SharedLayout = () => {
  return (
    <Wrapper>
      <main className="dashboard pt-16">
        <Navbar />
        <div className="dashboard-page">
          <Outlet />
        </div>
      </main>
    </Wrapper>
  );
};

export default SharedLayout;
