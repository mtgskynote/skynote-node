import axios from "axios";

/* getRecData  --------------
    return: res.body = [{recordingName, recordingId}, {...}, ...] 
*/
async function getRecData(studentId, scoreId) {
    try {
        // scoreId: "64d0de60d9ac9a34a66b4d45" is for the score "V_001_Cuerdas_Al_Aire_1_Suelta_A"
        const response = await axios.get("/api/v1/recordings/getRecData", {params: {studentId: studentId, scoreId: scoreId}});

        if (response.status===200) {
            return response.data; // save results locally
        } else {
            console.log('getRecData response.status is not 200!')
            return [];
        }
    } catch (error) {
        console.error('Error on axios getRecData', error);
    }
}

/* putRecording  --------------
    object with all fields including audio for studentRecording model
    returns: {recordingName, recordingId}
*/
async function putRecording(recordingObject) {           
    try {
        // foo, "V_001_Cuerdas_Al_Aire_1_Suelta_A"
        const response = await axios.put("/api/v1/recordings/putRecording", recordingObject);
        //console.log(`response from putRecording was ${JSON.stringify(response.data)}`);
        if (response.status===201) { /* 201 is the status code for a successful PUT */
            console.log('putRecording  returned OK')
            return response.data; 
        } else {
            console.log('putRecording failed!')
            return null;
        }
    } catch (error) {
        console.error('Error on axios putRecording', error);
    }
}

/* patchViewPermissions  
    sharing==true means teacher can view
    returns status code=200 if successful
*/
async function patchViewPermissions(recordingId, sharing) {
    try {
        // foo, "V_001_Cuerdas_Al_Aire_1_Suelta_A"
        const response = await axios.patch("/api/v1/recordings/patchViewPermissions", 
            {recordingId: recordingId, sharing: sharing});
        if (response.status===200) { 
            return(response.data)
        } else {
            console.log('patchViewPermissions failed!')
            return null;
        }
    } catch (error) {
        console.error('Error on axios patchViewPermissions', error);
    }
}

/* getRecording  
    returns entire document (including audio) if document was found
*/
async function getRecording(recordingId) {  
    try {
        // foo, "V_001_Cuerdas_Al_Aire_1_Suelta_A"
        const response = await axios.get("/api/v1/recordings/getRecording", 
        {params: {recordingId: recordingId}}
        );
        if (response.status===200) {
            return(response.data)
        } else {
            console.log('getRecording failed!')
            return null;
        }
    } catch (error) {
        console.error('Error on axios getRecNames', error);
    }
}

/* deleteRecording  */
async function deleteRecording(recordingId) {
    try {
        //console.log(`will try to delete recordingId ${recordingId}`)
        const response = await axios.delete(`/api/v1/recordings/deleteRecording/${recordingId}`);

        if (response.status===200) {
            return(response.data)
        } else {
            console.log('deleteRecording failed!')
        }
    } catch (error) {
        console.error('Error on axios deleteRecording', error);
    }
}

export { getRecData, getRecording, putRecording, deleteRecording, patchViewPermissions };
