import mongoose from "mongoose";
// import User from "./User.js";

const student_recordingsSchema = new mongoose.Schema({
    // recordingId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Recording', // Reference to the Recording model
    //   },

    recordingName:  String,

    scoreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Score', // Reference to the Score model
      },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Student model
      },

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Student model
      },
          
    audioData: Buffer,
    date: Date,
    sharing: Boolean,
    
    info: {
        title: String,
        pitchValues: [Number],
        pitchColor: String,
        repetition: Number,
        noteIds: [Number],
        noteColor: [Number],
        noteIndex: [Number],
        bpm: Number,
        statistics: String, 
    }

})

var student_recordings = mongoose.model('student_recordings', student_recordingsSchema);

export default student_recordings;
