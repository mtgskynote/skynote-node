import mongoose from "mongoose";

const xmlScoreSchema = new mongoose.Schema({
    fname: {
        type: String,
      },
    level: {
        type: Number,
    },
    skill: {
        type: String,
    }
})

var xmlScores = mongoose.model('scores', xmlScoreSchema);

export default xmlScores;
