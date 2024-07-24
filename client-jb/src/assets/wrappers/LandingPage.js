///////////////////////////////////////////
////////// THIS FILE IS OBSOLETE //////////
///////////////////////////////////////////
import styled from 'styled-components';

const Wrapper = styled.main` 

.site-header{
  background-color: #23292B; 
  height: 70px; 
  width: 100%; 
  position: fixed; 
  top: 0;
  z-index: 9999; 
}

.tab-row-container{
  display: flex; 
  justify-content: flex-end; 
  width: 70%; 
  position: absolute; 
  margin-right: 20px;
  margin-top: 5px; 
  margin-bottom: 10px; 
  top: 0;
  right: 0;
  padding: 5px 5px;
}


.logo-container{
  position: absolute; 
  width: 180px; 
  height: 20%; 
  top: 20%; 
  left: 10px;
  align-items: center; 
  justify-content: flex-start;
}

.skynote-container{
  position: absolute; 
  height: 60px;
  top: 0;
  left: 0; 
  margin-left: 80px; 
  margin-top: 3px;
  text-align: left;
  color: var(--blue-300); 
  text-align: center;
  font-size: 50px;
  font-family: var(--lato);
  font-style: normal;
  font-weight: 400;
  line-height: normal;

}

.work-section-top {
  position: relative;
  top: 80px;
  background-color: rgba(0, 136, 0, .35); 
  margin-bottom: 180px;
}


.background-image-container{ 
  position: absolute;
  width: 100%; 
  height: 100%;
  background-color: rgba(136, 0, 0, .35);
}

.background-image{ 
  position: absolute;
  width: 100%; 
  height: 100%;
}


.background-image-overlay{
  position: absolute; 
  width: 70%; 
  height: 100%; 
  background-color: rgba(45, 136, 235, .85);
  align-items: center;
  text-align: left;
}
.background-image-overlay h2{
  color: #23292B; 
  margin-top: 1rem;  
  margin-left: 4%;
  text-align: left;
  font-family: var(--lato);
  font-style: normal;
}

.background-image-overlay p{
  color: white; 
  margin-left: 2%;
  margin-right: 50%;
}

#overlay-signup-button{
  margin-left: 10%;
  margin-right: 50%;
  margin-bottom: 2%; 
}

.interest-link{
  font-size: 14px;
  margin-left: 10%;
  margin-right: 50%;
  margin-bottom: 0%; 
  bottom: 0;
  font-family: var(--lato);
}

.iphone-container{
  position: relative; 
  top: 310px;
  left: 70%; 
  transform: translate(-50%, -50%);
  width: 60%;
  height: 40%;
  z-index: 1;
  background-color: black;
  border-radius: 40px;
  margin-bottom: 10%;
}

.background-video {
  object-fit: cover;
  width: 98%; 
  margin-left: 8px;
  height: 345px;
  margin-top: 7px;
  border-radius: 40px;
}

.iphone-notch{
  position: absolute; 
  left: 0;
  background-color: black;
  z-index: 9999;
  width: 3%; 
  height: 40%;
  top: 28%;
  border-radius: 0 20px 20px 0;
}

.bottom-container{
  width: 100%;
  background-color: var(--blue-300);
  z-index: 1;
  text-align: center;
  align-items: center;
  border: 1px solid black;
}

.bottom-container h2{ 
  color: var(--grey-1000); 
  font-size: 45px;
  font-family: var(--lato);
  font-weight: 700;
  line-height: normal;
  z-index: 1;
  font-style: normal;
}

.login-button-bottom{
  border: 2px solid black;
  display: flex; 
  justify-content: center; 
  align-items: center; 
  height: 2.5rem; 
  background-color: transparent;
  border-radius: 20px;
  width: 8rem; 
  margin-top: 1rem;
  margin: auto;
}

p {
  color: var(--blue-300);
}




a{
  color: black;
}


/* --------------------------- */
  /*     image/text pairs */
  
  
  .grid-container {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* grid-template-rows: repeat(3, 1fr); */
    gap: 10px;
    max-width: 100%;
    margin: 60 auto;
  }
  
  .grid-container:hover {
    background: var(--blue-300);
    color: #ffffff;
    transition: 1s;
  }

  .grid-item {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 12px;
    max-width: 100%;
    max-height: 100%;
  }
  
  .grid-item img {
    max-width: 100%;
    max-height: 100%;
  }
  
  .grid-item video {
    max-width: 100%;
    max-height: 100%;
  }
  
  .grid-text-container{
    align-items: left; 
  }
  
  .grid-text-container h2{
    font-family: var(--inter);
    font-size: 4vw;
    color: var(--grey-900);
    text-align: left;
    padding-left: 2em;
    padding-right: 3em;
  }
  
  .grid-text-container p{
    font-family: var(--inter);
    font-size: 2vw;
    color: var(--grey-900);
    text-align: left;
    padding-left: 2em;
    padding-right: 3em;
  }

/* ---------------------------------------------- */

@media screen and (min-width: 320px) { 

  .dropdown {
    position: relative;
    display: inline-block;
  }

  /* Style the dropdown button (label) */
  .dropbtn {
    background-color: #23292B; 
    font-family: var(--lato);
    border: none; 
    color: var(--blue-300);
    padding: 10px;
    border: none;
    cursor: pointer;
  }


  /* Hide the checkbox input */
  .dropdown-toggle {
    display: none;
  }

  .dropdown-content {
    display: none;
    background-color: #23292B; 
    position: absolute;
    left: -6em;
    width: 14em;
    color: white;
  }

  .dropdown-content a {
    color: var(--blue-300); 
    text-decoration: none;
  }

  /* Show the dropdown content when checkbox is checked */
  .dropdown-toggle:checked + .dropbtn + .dropdown-content {
    display: block;
  }


  .tab-row{
    display: none;
  }

} 

/* ---------------------------------------------- */
@media screen and (min-width: 800px) {

  .dropdown {
    display: none;
  }

  .tab-row{
    display: flex;
    justify-content: right; 
    align-items: right; 
    height: 3rem; 
    background-color: transparent;
    border-radius: 25px;
  }


  .tab-login{
    color: white;
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 2.5rem; 
    background-color: transparent;
    border-radius: 14px;
    margin-right:0;
    width: 13%; 
  }

  .tab-login:hover{
    background-color:white;
    transition: 1s;
  }


  .tab-link{
    margin: 0 0.5rem; 
    padding: 0.5rem 1rem; 
    background-color: transparent; 
    font-family: var(--lato);
    border: none; 
    color: var(--blue-300);
    font-weight: 400; 
    text-decoration: none; 
    cursor: pointer; 
    font-size: 16px;
  }
  /* ---------------------------------------------- */

  .center {
    position: flex;
    right: 50%;
    left: 50%;
    align-items: center;
  }

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
      color: var(--blue-300);
    }


  }



  /* ---------------------------------------------- */


  
`;
export default Wrapper;
