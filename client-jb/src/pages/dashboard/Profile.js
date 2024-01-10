import React, { useState, useEffect } from 'react';
import { useAppContext } from "../../context/appContext";
import ProfileCSS from './Profile.module.css';
import axios from "axios";
import { getRecData, getRecording, putRecording, deleteRecording, patchViewPermissions } from "../../utils/studentRecordingMethods.js";

  //====================================================================
  //  This is a demo/test of the /recordings/XXX API 
  //====================================================================
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const handleRecordingTestSubmit = async (event) => {
    event.preventDefault();
    // ---------------------------------------
    var recdatalist=[];  // list of minimal recording data [{recordingName, recordingId},{...}, ...]

    //getRecData(studentId, scoreId)
    try {
      recdatalist = await getRecData("645b6e484612a8ebe8525933", "64d0de60d9ac9a34a66b4d45") // // scoreId: "64d0de60d9ac9a34a66b4d45" is for the score "V_001_Cuerdas_Al_Aire_1_Suelta_A"
      console.log(`getRecData return OK, and recdatalist is ${JSON.stringify(recdatalist)}`)
    } catch (error) {
      console.log(`error in getRecData`, error)
    }

    //putRecording(recordingObject)
    try{
      let result = await putRecording({studentId: "645b6e484612a8ebe8525933", scoreId: "64d0de60d9ac9a34a66b4d45", recordingName: "FooRecording"+getRandomInt(1,5), date: new Date(), sharing: false, info: {bpm: 100}});
      if (result!=null) {
        recdatalist.push(result); // save results locally
        console.log(`putRecording return OK, and recdatalist is now  ${JSON.stringify(recdatalist)}`)  
      }
    } catch (error) { 
      console.log(`error in putRecording`, error  );
    }  

    //patchViewPermissions(recordingId, sharing)
    try{
      let result = await patchViewPermissions(recdatalist[0].recorordingId, true);
      console.log(`patchViewPermissions return OK, and result is ${JSON.stringify(result)}`)
    } catch (error) { 
        console.log(`error in patchViewPermissions`, error)
    }

    //getRecording(recordingId)
    try{  
      let result = await getRecording(recdatalist[0].recorordingId)
      console.log(`getRecording returns and result is ${JSON.stringify(result)}`)  
    }
    catch (error) { 
        console.log(`error in getRecording`, error)
    } 

    //deleteRecording(recordingId)
    try{
      var result = await deleteRecording(recdatalist[0].recordingId)
      console.log(`deleteRecording return OK, and result is ${JSON.stringify(result)}`) 
    } catch (error) { 
        console.log(`error in deleteRecording`, error)
    } 
  }
  
  //====================================================================
  //  end of Recordings test/demo
  //====================================================================
 

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
    //------------------------------------------------- 

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
  console.log("Hi " + getCurrentUser() + "!");  // Here is prints out Promise 

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
  }, [getCurrentUser]);

  /*------------ Return the component! ----------*/
  return (
    <div>
      <div  align="center">
      <button onClick={handleRecordingTestSubmit}>Run Recordings DB test</button>
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
