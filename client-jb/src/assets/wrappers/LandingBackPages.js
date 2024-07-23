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


/*==========================================================*/


  
  p {
    color: var(--grey-600);
  }
  h3 {
    color: var(--grey-900);
  }
  .main-img {
    display: none;
  }
  
  .violinipad{ 
    // width: 100%; 
    // height: 600px;
    flex-shrink: 0;
    object-fit: cover;
  }
    
  .violinipad-container{ 
    position: absolute;
    top: 70px; 
    right: 0; 
    margin-right: 0;
    width: 100%; 
    height: 600px; 
    z-index: -1;  
  }

  .violinipad-overlay{
    position: absolute; 
    top: 50px; 
    left: 0; 
    width: 100%; 
    height: 600px; 
    z-index: 0; 
    justify-content: center;
    
  }

  .violinipad-overlay h1{
    position: absolute; 
    top: 40%;
    left: 50%; 
    transform: translate(-50%, -50%); 
    text-align: center;
    color: var(--white); 
    text-align: center;
    text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    font-size: 100px;
    font-family: var(--lato);
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    z-index: 1;
  }

  .violinipad-overlay h2{
    margin-top: 85px;
    position: absolute; 
    top: 50%;
    left: 50%; 
    transform: translate(-50%, -50%); 
    text-align: center;
    color: var(--white); 
    text-align: center;
    text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    font-size: 30px;
    font-family: var(--titleFont);
    font-style: normal;
    font-weight: 50;
    line-height: normal;
    z-index: 1;
  }

  

  .about-app{
    margin-top: 35rem;
    margin-left: 5rem;
    margin-right: 5rem;
  }
  
  .about-app h1{
    color: var(--grey-900);
    font-size: 45px;
    text-align: center;
    justify-content: center;
    margin: 0;
    font-weight: normal;
    font-style: normal;
    line-height: 150%;
    font-family: var(--inter);
  }

  .addspace{
    margin-top: 5rem;
  }

  .addspace1{
    margin-top: 5rem;
  }

  .addspace2{
    margin-top: 2rem;
  }
  .addspace3{
    margin-top: 40rem;
  }
  .addspace4{
    margin-top: 34rem;
  }
  .addspace5{
    margin-top: 37rem;
  }


  .addcolumnspace{
    margin-middle: 2rem;
  }

//  a{
//     color: black;
//   }

  @media screen and (min-width: 768px){
    section: {
      padding: 1em 7em;
    }
  }

  @media screen  and (min-width: 992px){

    .page {
      grid-template-columns: 1fr 1fr;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
    
    section: {
      padding: 3em;
    }

    .card {
      padding: 10em 1em;
    }

  }

 

  .primary-text {
    text-align: center;
    max-width: 80%;
  }
  .primary-heading {
    margin-top:0;
    color: --grey-900;
  }
  .primary-subheading {
  font-weight: 700;
  color: --grey-900;
  font-size: 1.15rem;
  text-align: center;
  }
  .work-section-wrapper {
  margin-top: 0;
  margin-bottom: 0;
  background-color: transparent;
  }
  .work-section-top p {
  text-align: center;
  margin: 0 auto; 
  margin-bottom: 0;
  max-width: 600px !important;
  font-size: 25px;
  font-family: var(--headingFont); 
  font-style: normal; 
  font-weight: 400; 
  line-height: 60px; 
  color: var(--grey-900);
  }
.top-p-container { 
  display: flex; 
  width: 100%; 
  height: 346px; 
  flex-direction: column; 
  justify-content: center; 
  flex-shrink: 0;
  background: radial-gradient(50.00% 50.00% at 50.00% 50.00%, rgba(45, 136, 235, 0.38) 0%, rgba(96, 210, 246, 0.00) 100%);
  }

.top-p-container h1{
  font-family: var(--lato);
  font-size: 80px;
}

.top-p-container h2{
  font-family: var(--inter);
}
  
.tag-line-top h1{
  white-space: nowrap;
  margin-top: 800px;
  color: white; 
}

.work-section-top {
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
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


.background-image-container{ 
  position: absolute;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100vh; 
  z-index: -1;  
}
.background-video-container {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 375px;
  width: 100vw;
  height: 100vh;
  z-index: 0;
}

.background-video {
  object-fit: cover;
  width: 50%; 
  height: auto;
}



.centered{
  position: absolute; 
  top: 30%;
  left: 50%; 
  transform: translate(-50%, -50%); 
  text-align: center;
  color: var(--grey-50); 
  color: #014d54;
  text-align: center;
  text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-size: 200px;
  font-family: var(--titleFont);
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  z-index: 1;
}
.app-info-container:hover{
  background: var(--blue-300);
  color: #ffffff;
  transition: 1s;
}
.app-info-container{ 
  display: flex;
  flex-direction: row-reverse; 
  justify-content: space-between;
  align-items: center;
  width: 1200px;
  height: 350px;
  margin-bottom: 30px;
  position: relative;
  flex-shrink: 0;
  border-radius: 0px;
  //background: var(#DDF2F5);
  //box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}
.info-container-right h2{
  color: var(--grey-800);
  font-size: 50px;
  text-align: right;
  justify-content: center;
  margin: 0;
  font-style: normal;
  font-weight: bold;
  line-height: 100%;
  margin-bottom: 1rem;
  //margin-right: 10rem;
}
.info-container-right-posture h2{
  color: var(--grey-800);
  font-size: 50px;
  text-align: right;
  justify-content: center;
  margin: 0;
  font-style: normal;
  font-weight: bold;
  line-height: 100%;
  margin-bottom: 1rem;
  //margin-right: 0.4rem; 
}
.info-container-right-posture p{
  color: var(--grey-800);
  text-align: right;
  //margin-right: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 200%;
  font-size: 20px;
}

.info-container-right p{
  color: var(--grey-800);
  text-align: right;
  //margin-right: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 200%;
  font-size: 20px;
}
.info-container-right {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  flex: 1;
  width: 100%;
}
.info-container-left h2{
  color: var(--grey-800);
  font-size: 50px;
  text-align: left;
  justify-content: left;
  margin: 0;
  font-style: normal;
  font-weight: bold;
  line-height: 100%;
  //margin-left: 7.5rem;
  margin-bottom: 1rem;
}
.info-container-left p{
  color: var(--grey-800);
  text-align: left;
  margin: 0;
  font-style: normal;
  font-weight: 400;
  line-height: 200%;
  font-size: 20px;
}
.info-container-left {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  width: 100%;
}

.info-container-left video{
  width: 610px;
  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  padding: 20px;
}
.info-container-right video{
  width: 610px;
  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  flex: 1;
  padding: 20px;
}
.work-section-info {
  width: 500px;
  min-height: 350px;
  background-color: black;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 1rem;
  color: #505050;
  margin: 1rem 2rem;
}
.work-section-info h2 {
  margin: 1rem 0rem;
}
.work-section-bottom {
  margin-top: 0;
  margin-bottom: 0; 
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
p {
  margin-top: 0rem
  margin-bottom: 0rem;
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
.row{
  display: flex;
  flex-wrap: wrap;
  padding: 2em 1em;
  text-align: center;
  background-color: --grey-900;
}

.colorbox {
  background-color: #2D88EB;
  width: 100%
}
.wrap {
  width: 80%;
  max-width: 200em;
  margin: 0 auto;
  padding: 0.5em 0.625em;
}




.card{
 // box-shadow: 0 0 2.5em rgba(25, 0, 58, 0.15);
  padding: 2em;
  border-radius: 0em;
  border: 1px transparent;
  color: transparent;
  transition: all 0.3s ease-in-out;
  background-color: transparent;
  align-items: "center";
}
.card .img-container{
  width: 20em;
  height: 17em;
  //background-color: #1f003b;
  //padding: 0.5em;
  //border-radius: 70%;
  //margin: 0 auto;
  object-fit: cover;
}

.card .img2{
  padding: 1em;
  height: 100%;
  /* height: 400px; */
}

.card a{
  text-align: center;
}

.card img{
  width: 68%;
  height: 15em;
  //border-radius: 50%;
  object-fit: cover;
}

.card h3{
  padding: 1em 0 0.5em 0;
  font-weight: 700;
  text-align: center;
}

.card p{
  padding: 1em 0 0.5em 0;
  font-weight: 300; 
  text-align: center;
  margin: 2em 0 2em 0;
  //text-transform: capitalize;
  letter-spacing: 1px;
  color: --grey-900;
}

.card a{
  text-decoration: none;
  color: inherit;
  font-size: 1.4em;
  text-align: center;
  
}


.card:hover{
  background: var(--blue-300);
  color: #ffffff;
}

.card:hover .img-container{ 
  transform: scale(1.15)
}
.card:hover p{ 
  color: #ffffff;
}
.icons{
  margin: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.icons a{
  color: var(--grey-900);
}

.publicationbtn {
  margin: auto;
  display: flex;
  justify-content: center; 
  align-items: center;
  color: var(--grey-900);
}

.publicationbtn p {
  margin: 0;
  padding: 0.5rem 1rem; 
  border: 1px solid var(--grey-900); 
  border-radius: 5px; 
  cursor: pointer; 
  transition: background-color 0.3s ease; 
}

.publicationbtn p:hover {
  background-color: var(--grey-900);
  color: white;
}



.posts {
  display: grid;
  grid: repeat(auto-fit,minmax(0,1fr))/1fr;
  grid-gap: 5rem 1.5rem;
  margin-top: calc(0.25rem * 10);

}


/* --------------------------- */
/*     image/text pairs */


.grid-container {
  position: relative;
  display: grid;
  /* grid-template-columns: repeat(2, 1fr); */
  grid-template-rows: none /* repeat(2, 1fr); */ /* I cant believe this 'none' works. */
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

/* if item is on the left, push it right */
.grid-text-container-left {

  font-family: var(--inter);
  font-size: 2vw;
  color: var(--grey-900);
  text-align: right;
  padding-left: 10em;
  padding-right: 2em;
}

/* if the item is on the right, push it left */
.grid-text-container-right {

  font-family: var(--inter);
  font-size: 2vw;
  color: var(--grey-900);
  text-align: left;
  padding-left: 2em;
  padding-right: 10em;
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
    padding: 100px
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

  .column{
    flex: 100%;
    max-width:100%;
    padding: 0 1em;
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

  .grid-container {
    position: relative;
    display: grid;
    grid-template-columns: repeat(2, 1fr);  /* luxury! */
    /* grid-template-rows: repeat(3, 1fr); */
    gap: 10px;
    max-width: 100%;
    margin: 60 auto;
  }

  /* -------------------------------------------------*/
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

  .column{
    flex: 0 0 33.33%;
    max-width: 33.33%;
    padding: 0 1em;
  }
}

.centercontainer{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; /* Set a width for the container */
}

`;
export default Wrapper;
