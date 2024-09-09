import mongoose from 'mongoose';

const xmlScoreSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
  skill: {
    type: String,
    default: '',
  },
});

export default { xmlScoreSchema };
