import React, { useState, useEffect } from 'react';
import { useAppContext } from "../../context/appContext";
import ProfileCSS from './Profile.module.css';

import axios from "axios";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


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

    // ---------------------------------------
    var recdatalist=[];  // list of core recording data [{recordingName, recordingId},{...}, ...]

    /* getRecData  */
    try {
      // scoreId: "64d0de60d9ac9a34a66b4d45" is for the score "V_001_Cuerdas_Al_Aire_1_Suelta_A"
      const response = await axios.get("/api/v1/recordings/getRecData", {params: {studentId: "645b6e484612a8ebe8525933", scoreId: "64d0de60d9ac9a34a66b4d45"}});

      if (response.status===200) {
        console.log('get names worked  (even though there may be none returned)')
        recdatalist = response.data; // save results locally
        console.log(`       response.data is  ${JSON.stringify(recdatalist)}`)

      } else {
        console.log('getRecData response.status is not 200!')
      }
    } catch (error) {
      console.error('Error on axios getRecData', error);
    }


    /* putRecording  */
    try {
      // foo, "V_001_Cuerdas_Al_Aire_1_Suelta_A"
      const response = await axios.put("/api/v1/recordings/putRecording", 
        {studentId: "645b6e484612a8ebe8525933", scoreId: "64d0de60d9ac9a34a66b4d45", recordingName: "FooRecording"+getRandomInt(1,5), date: new Date(), sharing: false, info: {bpm: 100}}
      );
      console.log(`response from putRecording was ${JSON.stringify(response.data)}`);

      if (response.status===201) { /* 201 is the status code for a successful PUT */
        console.log('putRecording  returned OK')
        recdatalist.push(response.data); // save results locally
      } else {
        console.log('putRecording failed!')
      }
    } catch (error) {
      console.error('Error on axios putRecording', error);
    }

    /* patchViewPermissions  */
    try {
      // foo, "V_001_Cuerdas_Al_Aire_1_Suelta_A"
      const response = await axios.patch("/api/v1/recordings/patchViewPermissions", 
        {recordingId: recdatalist[0].recorordingId, sharing: true});
      console.log(response.data);
      if (response.status===200) { 
        console.log('patchViewPermissions  returned OK')
      } else {
        console.log('patchViewPermissions failed!')
      }
    } catch (error) {
      console.error('Error on axios patchViewPermissions', error);
    }

    /* getRecording  */
    try {
      // foo, "V_001_Cuerdas_Al_Aire_1_Suelta_A"
      const response = await axios.get("/api/v1/recordings/getRecording", 
        {params: {recordingId: recdatalist[0].recorordingId,}}
      );

      if (response.status===200) {
        console.log('getRecording worked!')
        console.log(`       response.data is ${JSON.stringify(response.data)}`)
      } else {
        console.log('getRecording failed!')
      }
    } catch (error) {
      console.error('Error on axios getRecNames', error);
    }




    /* deleteRecording  */
    try {
      // foo, "V_001_Cuerdas_Al_Aire_1_Suelta_A"
      const response = await axios.get("/api/v1/recordings/deleteRecording", 
        {params: {recordingId: "FooRecording5",}}
      );

      if (response.status===200) {
        console.log('deleteRecording worked!')
        console.log(`       response.data is ${JSON.stringify(response.data)}`)
      } else {
        console.log('deleteRecording failed!')
      }
    } catch (error) {
      console.error('Error on axios deleteRecording', error);
    }

    // ---------------------------------------
  
    //-----  print the form data out just for fun. ---  
    const formData = new FormData(event.target);
    let result = '';
    for (let [name, value] of formData.entries()) {
      result += `${name}: ${value}\n`;
    }
    alert(result);
    //------------------------------------------------- 

    //-----  send the form data to the server. ---
    try {
      const response = await axios.post('/updateProfileData', {
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
  console.log("Hi " + getCurrentUser() + "!");  // Here is prints out Promise 

  useEffect(() => {
    const fetchDataFromAPI = () => {
      console.log(`in fetchDataFromAPI, about to call getCurentUser()`)
      getCurrentUser() // fetchData is already an async function
        .then((result) => {
          console.log(`getCurentUser() has returnd this result: ${result}`)
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
  }, [getCurrentUser]);

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
