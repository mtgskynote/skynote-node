import mongoose from "mongoose";
console.log(`loading xmlScoreModels!`);
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


// Helper function that returns an array of the valid level numbers
xmlScores.levels = function(cb){
    xmlScores.distinct("level", (err, distinctValues) => {
        if (err) {
            console.error('Error:', err);
        } else {
            cb(distinctValues)
        }
    })
}

// Helper function that returns an array of the valid skills for a given level
xmlScores.levelSkills = function(levelNum, cb){
    xmlScores.distinct("skill", { ["level"]: levelNum }, (err, distinctValues) => {
        if (err) {
        console.error('Error:', err);
        } else {
        cb(distinctValues)
        }
    })   
 }

// DEMO of using the 'helper' functions above to get the scores for level&skills
xmlScores.levels(function(levels){
    levels.forEach(function(levelNum){
        xmlScores.levelSkills(levelNum, function(skills){
            skills.forEach(function(dval){
                // Get scores for a given level and skill
                xmlScores.find({level:levelNum, skill: dval}, function(err, docs){
                    console.log(`LEVEL: ${levelNum}, SKILL: ${dval}`);
                    for(let i=0;i<docs.length;i++){
                        console.log(`     ${docs[i].fname}`);
                    }
                })
            })
        })
    })
})


export default xmlScores;
