import axios from "axios";

/* getRecData  --------------
    return: res.body = [{recordingName, recordingId}, {...}, ...] 
*/
async function getAllAssignments(studentId) {
    try {
        // scoreId: "64d0de60d9ac9a34a66b4d45" is for the score "V_001_Cuerdas_Al_Aire_1_Suelta_A"
        const response = await axios.get("/api/v1/assignments/getAllAssignments"); //{params: {studentId: studentId}}

        if (response.status===200) {
            return response.data; // save results locally
        } else {
            console.log('getAllAssignments response.status is not 200!')
            return [];
        }
    } catch (error) {
        console.error('Error on axios getAllAssignments', error);
    }
}


export { getAllAssignments};
