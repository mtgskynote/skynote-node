import styled from 'styled-components'

const Wrapper = styled.main`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  h1 {
    font-weight: 700;
    span {
      color: var(--primary-500);
    }
  }
  p {
    color: var(--grey-600);
  }
  .main-img {
    display: none;
  }
  @media (min-width: 992px) {
    .page {
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
  .primary-text {
    text-align: center;
    max-width: 80%;
  }
  .primary-subheading {
  font-weight: 700;
  color: #fe9e0d;
  font-size: 1.15rem;
  }

  .work-section-wrapper {
  margin-top: 15rem;
  }
  .work-section-top p {
  text-align: center;
  max-width: 600px !important;
  }
.work-section-top h1 {
  max-width: 700px !important;
}
.work-section-top {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.work-section-info {
  width: 290px;
  min-height: 350px;
  background-color: white;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 1rem;
  color: #505050;
  margin: 1rem 2rem;
}
.work-section-info h2 {
  margin: 1rem 0rem;
}
.work-section-bottom {
  margin-top: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.work-section-info p {
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: 600;
}
.work-section-info svg {
  width: 2em;
  height: 2em;
}
`
export default Wrapper
