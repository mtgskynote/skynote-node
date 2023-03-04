import { Outlet, Link } from "react-router-dom";
import Wrapper from "../../assets/wrappers/SharedLayout";

const SharedLayout = () => {
  return (
    <Wrapper>
      <nav>
        <div>
          <Link to="add-job">add job</Link>
        </div>
        <div>
          <Link to="all-jobs">all jobs</Link>
        </div>
      </nav>
      <Outlet />
    </Wrapper>
  );
};

export default SharedLayout;
