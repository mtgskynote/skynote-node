import axios from "axios";

async function getAllAssignments(studentId) {
    try {
        // scoreId: "64d0de60d9ac9a34a66b4d45" is for the score "V_001_Cuerdas_Al_Aire_1_Suelta_A"
        const response = await axios.get("/api/v1/assignments/getAllAssignments", {params: {studentId: studentId}});

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

async function putAssignment(assignmentObject) {           
    try {
        const response = await axios.put("/api/v1/assignments/putAssignment", assignmentObject);
        console.log(`response from putAssignment was ${JSON.stringify(response.data)}`);
        if (response.status===201) { /* 201 is the status code for a successful PUT */
            console.log('putAssignment  returned OK')
            return response.data; 
        } else {
            console.log('putAssignment failed!')
            return null;
        }
    } catch (error) {
        console.error('Error on axios putAssignment', error);
    }
}

async function deleteAssignment(assignmentId) {
    try {
        // console.log(`will try to delete assignmentId ${assignmentId}`)
        const response = await axios.delete(`/api/v1/assignments/deleteAssignment/${assignmentId}`);

        if (response.status===200) {
            return(response.data)
        } else {
            console.log('deleteAssignment failed!')
        }
    } catch (error) {
        console.error('Error on axios deleteAssignment', error);
    }
}


export { getAllAssignments, putAssignment, deleteAssignment };
