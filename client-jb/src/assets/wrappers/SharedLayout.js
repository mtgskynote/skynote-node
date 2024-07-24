///////////////////////////////////////////
////////// THIS FILE IS OBSOLETE //////////
///////////////////////////////////////////
import styled from 'styled-components';

const Wrapper = styled.section`
  .dashboard {
    display: grid;
    grid-template-columns: 1fr;
  }
  .dashboard-page {
    width: 100vw;
    margin: 0 auto;
  }

  /*
  @media (min-width: 992px) {
    .dashboard {
      grid-template-columns: auto 1fr;
    }
    .dashboard-page {
      width: 100%;
    }
  }
  */
`;
export default Wrapper;
