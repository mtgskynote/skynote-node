import React, { useState, useEffect } from 'react';
import { useAppContext } from "../../context/appContext";
import ProfileCSS from './Profile.module.css';
import axios from "axios";

/*
The useEffect hook runs once when the component mounts ([] as a dependency means it runs only once).
Inside useEffect, an asynchronous operation (fetching data in this case) is performed.
While the data is being fetched, the component displays a loading message (<p>Loading...</p>).
Once the data is fetched successfully, the state data is updated, and the loading state is set to false.

This might be overkill for grabbing the user's email, but it's a good pattern to follow for more complex data fetching from the server.
*/

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  //--------------------------------------------------------------------
  const [inputs, setInputs] = useState({});
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}))
  }



 

  const handleSubmit = async (event) => {
    event.preventDefault();

  
    //-----  print the form data out just for fun. ---  
    const formData = new FormData(event.target);
    let result = '';
    for (let [name, value] of formData.entries()) {
      result += `${name}: ${value}\n`;
    }
    alert(result);
    // //------------------------------------------------- 


    //-----  send the form data to the server. ---
    try {
      const response = await axios.post('/api/v1/auth/updateProfileData', {
        method: 'POST',
        body: formData
      });
  
      if (response.ok) {
        console.log('response worked!')
      } else {
        console.log('response failed!')
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }


  const { getCurrentUser } = useAppContext();
  //console.log("Hi " + getCurrentUser() + "!");  // Here is prints out Promise 
  console.log("Hi .... !");  // Here is prints out Promise 

  useEffect(() => {
    const fetchDataFromAPI = () => {
      console.log(`in fetchDataFromAPI, about to call getCurentUser()`)
      getCurrentUser() // fetchData is already an async function
        .then((result) => {
          console.log(`getCurentUser() has returnd this result: ${JSON.stringify(result)}`)
          setData(result);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(`getCurentUser() error: ${error}`)
          // Handle errors if necessary
        });
    };

    fetchDataFromAPI();
  }, []);



  /*------------ Return the component! ----------*/
  return (
    <div>
      <div  align="center">
      <h1 >Skynote Profile</h1>
      <div  align="left">

      {loading ? (
        <p>Loading...</p>
      ) : data ? (

        <form onSubmit={handleSubmit} width="50%">

          <label className={ProfileCSS.profilelabel} >First Name:   </label>
          <input 
            className={ProfileCSS.profileinput}
            type="text" 
            name="name" 
            value={inputs.name || data.name} 
            onChange={handleChange}
          />

          <label className={ProfileCSS.profilelabel} >Family Name:   </label>
          <input 
            className={ProfileCSS.profileinput}
            type="text" 
            name="lastName" 
            value={inputs.lastName || data.lastName} 
            onChange={handleChange}
          />



          <label className={ProfileCSS.profilelabel} >Email:  </label>
          <input 
            className={ProfileCSS.profileinput}
            type="text" 
            name="email" 
            value={inputs.email || data.email} 
            onChange={handleChange}
          />

          
          <label className={ProfileCSS.profilelabel} >Age:   </label>
          <input 
            className={ProfileCSS.profileinput}
            type="number" 
            name="age" 
            value={inputs.age || data.email} 
            onChange={handleChange}
          /><br/>
          <br/><br/>
          <div  align="center">
            <input type="submit"
              value="Update Data" />
          </div>

          </form>

      ) : (
        <p>No data available.</p>
      ) }



      </div>
      </div>
    </div>
      
  );
};

export default Profile;
