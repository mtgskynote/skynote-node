import axios from 'axios';

/**
 * Fetches all assignments for a given student.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Array>} - A promise that resolves to an array of assignments.
 */
async function getAllAssignments(studentId) {
  try {
    const response = await axios.get('/api/v1/assignments/getAllAssignments', {
      params: { studentId: studentId },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.log('getAllAssignments response.status is not 200!');
      return [];
    }
  } catch (error) {
    console.error('Error on axios getAllAssignments', error);
  }
}

/**
 * Updates an assignment with the given assignment object.
 * @param {Object} assignmentObject - The assignment object to update.
 * @returns {Promise<Object|null>} - A promise that resolves to the updated assignment data or null if the update failed.
 */
async function putAssignment(assignmentObject) {
  try {
    const response = await axios.put(
      '/api/v1/assignments/putAssignment',
      assignmentObject
    );
    console.log(
      `response from putAssignment was ${JSON.stringify(response.data)}`
    );
    if (response.status === 201) {
      console.log('putAssignment returned OK');
      return response.data;
    } else {
      console.log('putAssignment failed!');
      return null;
    }
  } catch (error) {
    console.error('Error on axios putAssignment', error);
  }
}

/**
 * Deletes an assignment with the given assignment ID.
 * @param {string} assignmentId - The ID of the assignment to delete.
 * @returns {Promise<Object>} - A promise that resolves to the response data.
 */
async function deleteAssignment(assignmentId) {
  try {
    const response = await axios.delete(
      `/api/v1/assignments/deleteAssignment/${assignmentId}`
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.log('deleteAssignment failed!');
    }
  } catch (error) {
    console.error('Error on axios deleteAssignment', error);
  }
}

/**
 * Fetches the latest assignment for a given student.
 * @param {string} studentId - The ID of the student.
 * @returns {Promise<Object>} - A promise that resolves to the latest assignment data.
 */
async function getLatestAssignment(studentId) {
  try {
    const response = await axios.get(
      '/api/v1/assignments/getLatestAssignment',
      { params: { studentId: studentId } }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.log('getLatestAssignment response.status is not 200!');
      return [];
    }
  } catch (error) {
    console.error('Error on axios getLatestAssignment', error);
  }
}

/**
 * Updates an assignment with the given parameters.
 * @param {string} assignmentId - The ID of the assignment to update.
 * @param {string} studentId - The ID of the student.
 * @param {string} scoreId - The ID of the score.
 * @param {string} recordingId - The ID of the recording.
 * @returns {Promise<Object|null>} - A promise that resolves to the updated assignment data or null if the update failed.
 */
async function updateAssignment(assignmentId, studentId, scoreId, recordingId) {
  try {
    const response = await axios.put(
      '/api/v1/assignments/updateTaskAssignment',
      {
        studentId: studentId,
        assignmentId: assignmentId,
        scoreId: scoreId,
        recordingId: recordingId,
      }
    );
    console.log(
      `response from putAssignment was ${JSON.stringify(response.data)}`
    );
    if (response.status === 200) {
      console.log('updateAssignment returned OK');
      return response.data;
    } else {
      console.log('updateAssignment failed!');
      return null;
    }
  } catch (error) {
    console.error('Error on axios updateAssignment', error);
  }
}

export {
  getAllAssignments,
  putAssignment,
  deleteAssignment,
  getLatestAssignment,
  updateAssignment,
};
