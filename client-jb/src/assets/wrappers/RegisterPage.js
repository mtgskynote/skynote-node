import styled from "styled-components";

const Wrapper = styled.section`
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
  }

  .site-header{
    background-color: #23292B; 
    height: 70px; 
    width: 100%; 
    position: fixed; 
    top: 0; 
    left: 0; 
    z-index: 9999; 
  }
  .tab-row{
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 3rem; 
    background-color: transparent;
    border-radius: 25px;
  }
  .tab-login{
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 2.5rem; 
    background-color: transparent;
    border-radius: 20px;
    margin-right: 0;
    width: auto;
  }
  .tab-login:hover{
    background-color:white;
    transition: 1;
  }
  
  .tab-row-container{
    display: flex; 
    justify-content: flex-end; 
    width: min-width; 
    position: absolute; 
    margin-right: 20px;
    margin-top: 5px;
    margin-bottom: 10px;
    top: 0;
    right: 0; 
    padding: 5px 5px;
  }
  
  .tab-link{
    margin: 0 0.5rem; 
    padding: 0.5rem 1rem; 
    background-color: transparent; 
    font-family: var(--lato);
    border: none; 
    color: var(--blue-300);
    font-weight: 700; 
    text-decoration: none; 
    cursor: pointer; 
    font-size: 16px;
  }
  
  .logo-container{
    position: absolute;
    width: 20%;
    height: 20%; 
    top: 20%; 	
    left: 10px;
    align-items: center; 
    justify-content: flex-start;
    //padding: 20px; 
  }
  .skynote-container{
    position: absolute; 
    height: 60px;
    top: 0;
    left: 0; 
    margin-left: 8%;
    margin-top: 3px;
    text-align: left;
    color: var(--blue-300); 
    text-align: center;
    font-size: 50px;
    font-family: var(--lato);
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    z-index: 1;
  }

  h3 {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }

  .google-btn {
    padding: 5px;
    width: 100%;
    border: transparent;
    background-color: transparent;
    border-radius: 0.5rem;
    color: var(--primary-500);
    transition: all 0.4s;
    cursor: pointer;
  }
`;
export default Wrapper;
