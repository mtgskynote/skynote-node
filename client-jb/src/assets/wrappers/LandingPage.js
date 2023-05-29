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
      color: var(--primary-500);
    }
  }
  p {
    color: var(--grey-600);
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
    .column{
      flex: 0 0 33.33%;
      max-width: 33.33%;
      padding: 0 1em;
    }
  }
  .primary-text {
    text-align: center;
    max-width: 80%;
  }
  .primary-subheading {
  font-weight: 700;
  color: #505050;
  font-size: 1.15rem;
  text-align: center;
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
  margin-top: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}
.work-section-info {
  width: 500px;
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
  color: black;
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
`
export default Wrapper
