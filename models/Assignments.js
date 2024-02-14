import mongoose from "mongoose";


const assignmentsSchema = new mongoose.Schema({
    

    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the Score model
      },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Reference to the User model
          
        },
      ],
    
    message:  String,
    post: Date,
    due: Date,
    tasks: [
        {
            _id: false, // Disable _id generation for tasks
            score: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Score', // Reference to the Score model
            }, 
            answers:[
                {
                        _id: false, // Disable _id generation for answers
                        studentId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'User', // Reference to the User model
                        },
                        recordingId: String,
                        grade: Number,
                        comment: String,

                    }
                
            ]
        }   
        
    ],

})

var assignments = mongoose.model('assignments', assignmentsSchema);

export default assignments;
