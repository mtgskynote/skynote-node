import styled from 'styled-components'


const Wrapper = styled.main`
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
  p {
    color: var(--blue-300);
  }
  .main-img {
    display: none;
  }
  
  .addspace{
    margin-top: 5rem;
  }

 a{
    color: black;
  }

  /* @media screen and (min-width: 768px){
    section: {
      padding: 1em 7em;
    }
  } */

  /* @media screen  and (min-width: 992px){

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
    .column{
      flex: 0 0 33.33%;
      max-width: 33.33%;
      padding: 0 1em;
    }
  } */

  .primary-text {
    text-align: center;
    max-width: 80%;
  }
  .primary-heading {
    margin-top:0;
  }
  .primary-subheading {
  font-weight: 700;
  color: #505050;
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
  font-weight: 400; 
  line-height: 60px; 
  color: var(--blue-300);
  }
.top-p-container { 
  display: flex; 
  width: 1000px; 
  height: 346px; 
  flex-direction: column; 
  justify-content: center; 
  flex-shrink: 0;
  }


.tag-line-top h1{
  white-space: nowrap;
  margin-top: 850px; /*800px with video*/
  color: var(--blue-300); 
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

.work-section-top {
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color:transparent;
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
  margin-right:0;
  width: auto; 
}
.tab-login:hover{
  background-color:white;
  transition: 1s;
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
.background-image{ 
  width: 100%; 
  height: 100%;
}

.background-image-container{ 
  position: absolute;
  top: 70px; 
  right: 0; 
  margin-right: 0;
  width: 100%; 
  height: 600px; 
  z-index: -1;  
}
.background-image-overlay{
  position: absolute; 
  top: 70px;
  left: 0; 
  width: 50%; 
  height: 600px; 
  z-index: 0; 
  background-color: rgba(45, 136, 235, .85);
  justify-content: center;
}
.background-image-overlay h2{
  color: #23292B; 
  margin-top: 5rem;  
  text-align: left;
  font-size: 45px;
  font-family: var(--lato);
  font-style: normal;
  font-weight: 600;
  line-height: 1.2;
  padding: 0;
  margin-left: 5rem;
  width: 70%;
}
.background-image-overlay p{
  color: #23292B; 
  text-align: left;
  font-size: 20px;
  margin-left: 5rem;
  font-family: var(--lato);
  font-style: normal;
  font-weight: 200;
  line-height: 1.8;
  padding: 0;
  top: 0;
  width: 70%;
}
.interest-link{
  font-size: 18px;
  text-align: left;
  margin-left: 80px;
  margin-top: 1rem;
  font-family: var(--lato);
}

.login-button{
  border: 2px solid black;
  display: flex; 
  justify-content: center; 
  align-items: center; 
  height: 2.5rem; 
  background-color: transparent;
  border-radius: 20px;
  width: 8rem; 
  margin-top: 1rem;
  margin-left: 5rem;
}

.login-link{
  margin: 0 0.5rem; 
  padding: 0.5rem 1rem; 
  background-color: transparent; 
  font-family: var(--lato);
  border: none; 
  color: black;
  font-weight: 700; 
  text-decoration: none; 
  cursor: pointer; 
}


.iphone-container{
  position: relative; 
  top: 710px;
  left: 50%; 
  transform: translate(-50%, -50%);
  width: 50%;
  height: 360px;
  z-index: 1;
  background-color: black;
  border-radius: 40px;
  margin-bottom: 10%;
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
  width: 98%; 
  height: 345px;
  margin-top: 7px;
  border-radius: 33px;
}

.iphone-notch{
  position: absolute; 
  left: 0;
  background-color: black;
  z-index: 9999;
  width: 33px; 
  height: 170px;
  top: 102.5px;
  border-radius: 0 20px 20px 0;
}

.centered{
  position: absolute; 
  top: 30%;
  left: 50%; 
  transform: translate(-50%, -50%); 
  text-align: center;
  color: var(--blue-300); 
  text-align: center;
  text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-size: 200px;
  font-family: var(--titleFont);
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  z-index: 1;
}
.image-container{
  position: absolute;
  flex: 1;
  top: 900px;
  right: 0; 
  width: 40%; 
  height: 40%; 
  z-index: 1;
  margin-right: 80px;
}

.text-container-1{
  display: flex; 
  flex-direction: column;
  align-items: left; 
  margin-top: 48%;
  position: relative; 
  left: 5%; 
  top: 50%; 
  transform: translateY(-50%);
  margin-right: 60%;
  z-index: 1;
}

.text-container-1 h2{
  font-family: var(--inter);
  font-size: 50px;
  color: var(--grey-900);
  margin-bottom: 2rem;
  text-align: left;
}

.text-container-1 p{
  font-family: var(--inter);
  font-size: 20px;
  color: var(--grey-900);
  margin-top: 0;
  text-align: left;
  line-height: 130%;
}

.info-container-1 {
  position: absolute;
  margin-top: 950px; 
  width: 100%;
  height: 500px;
  background-color: transparent;
  z-index: -1;
}

.text-container-2 {
  display: flex; 
  flex-direction: column;
  align-items: flex-end;
  margin-top: 1670px; 
  position: absolute; 
  right: 5%; 
  top: 10%;
  transform: translateY(-50%);
  width: 35%;
}
.text-container-2 h2 {
  font-family: var(--inter);
  font-size: 50px;
  color: var(--grey-900);
  margin-bottom: 2rem;
  text-align: left;
  margin-right: 10%;
}
.text-container-2 p{
  font-family: var(--inter);
  font-size: 20px;
  color: var(--grey-900);
  margin-top: 0;
  line-height: 130%;
  text-align: left;
}
.image-container-2{
  display: flex; 
  flex-direction: column;
  align-items: left; 
  position: relative; 
  transform: translateY(-50%);
  margin-right: 40%;
  right: 0; 
  width: 45%; 
  height: 45%; 
  z-index: 1;
  margin-top: 14%;
  left: 5%; 
}
.text-container-3{
  display: flex; 
  flex-direction: column;
  align-items: left; 
  margin-top: 10%;
  position: relative; 
  left: 5%; 
  top: 50%; 
  transform: translateY(-50%);
  margin-right: 55%;
  margin-bottom: 2%;
}

.text-container-3 h2{
  font-family: var(--inter);
  font-size: 50px;
  color: var(--grey-900);
  margin-bottom: 2rem;
  text-align: left;
}

.text-container-3 p{
  font-family: var(--inter);
  font-size: 20px;
  color: var(--grey-900);
  margin-top: 0;
  margin-right: 20px;
  text-align: left;
  line-height: 130%;
}
.image-container-3{
  position: absolute;
  flex: 1;
  top: 2100px;
  right: 0; 
  width: 42%; 
  height: 42%; 
  z-index: 1;
  margin-right: 80px;
}

.bottom-container{
  width: 100vw;
  background-color: var(--blue-300);
  height: 120px;
  z-index: 1;
}
.bottom-container h2{ 
  text-align: center;
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
  margin-left: 45.5%;
}
.login-link-bottom{
  align-items: center;
  margin: 0 0.5rem; 
  padding: 0.5rem 1rem; 
  background-color: transparent; 
  font-family: var(--lato);
  border: none; 
  color: var(--grey-1000);
  font-weight: 700; 
  text-decoration: none; 
  cursor: pointer; 
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
}
.column{
  width: 50%;
  padding: 3em; 
  }
.card{
  box-shadow: 0 0 2.5em rgba(25, 0, 58, 0.15);
  padding: 2em;
  border-radius: 1em;
  color: #1f003b;
  transition: all 0.3s ease-in-out;
  background-color: #ffffff;
  align-items: "center";
}
.card .img-container{
  width: 8em;
  height: 8em;
  background-color: #1f003b;
  padding: 0.5em;
  border-radius: 70%;
  margin: 0 auto;
}

.card .img2{
  padding: 1em;
  border-radius: 0em;
  width: 90%;
}

.card a{
  text-align: center;
}

.card img{
  width: 90%;
  border-radius: 50%;
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
  text-transform: capitalize;
  letter-spacing: 1px;
  color: transparent;
}

.card a{
  text-decoration: none;
  color: inherit;
  font-size: 1.4em;
  text-align: center;
}
.card:hover{
  background: var(--primary-500);
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

.publicationbtn{
  margin: auto;
  display: flex;
  align-items: right;
}

@media screen and (max-width: 600px) {
  .background-image{
    display: none;
  }

  .logo-container{
    width: 30%;
  }

  .skynote-container{
    margin-left: 12%
  }

  .tab-link{
    font-size: 1rem;
    width: 5rem;
  }

  .background-image-overlay{
    width: 250%;
    height: 500px;
  }

  .background-image-overlay h2{
    width: 80%;
    margin-right: 5rem;
    font-size: 50px;
  }
  .background-image-overlay p{
    font-size: 25px;
    width: 180%;
  }

  .iphone-container{
    width: 80%; 
    height: auto; 
    margin-bottom: 20px;
    position: relative
  }

  .background-video-container {
    margin-top: 200px; 
    height: 50vh 
  }

  .background-video{
    display: none;
  }

  .iphone-notch{
    display: none;
  }
  
  .tab-row{
    margin-right: 30px;
  }

  .text-container-1{
    margin-top: 480px;
    width: 150%;
  }

  .image-container{
    left: 160%;
    width: 80%;
    position: relative;
    top: 630px;
  }

  .text-container-2{
    position: relative;
    right: 0;
    margin-top: 120px;
    left: 130%;
    width: 110%;
  }

  .image-container-2{
    position: relative; 
    bottom: 760px;
    width: 100%;
    height: 100%;
    left: 30px;
  }

  @media screen and (max-width: 768px) {
    .tab-row-container {
      justify-content: center;
    }

    .background-image-overlay h2 {
      width: 100%;
      margin-right: 0;
      text-align: center;
      font-size: 36px;
    }

    .background-image-overlay p {
      font-size: 18px;
      width: 100%;
    }

    .iphone-container {
      width: 90%;
      height: auto;
      margin-bottom: 20px;
    }

    .background-video-container {
      margin-top: 200px;
      height: 50vh;
    }

    .image-container {
      display: none;
    }

    .text-container-1 {
      margin-top: 200px;
      width: 100%;
      align-items: center;
      text-align: center;
    }

    .text-container-2 {
      width: 100%;
      text-align: center;
      margin-top: 50px;
    }

    .image-container-2 {
      display: none;
    }

    .text-container-3 {
      margin-top: 50px;
      width: 100%;
      align-items: center;
      text-align: center;
    }

    .work-section-bottom {
      flex-direction: column;
    }

    .card {
      width: 100%;
      padding: 1em;
      margin: 1rem 0;
    }


}


`
export default Wrapper