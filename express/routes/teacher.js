const { Router } = require('express');
const db = require('../database');

const router = Router();

// Put API
router.put('/', async (req, res) => {
    //teacher Add grade
    const {userId} = req.body;
    const {courseId} = req.body;
    const{marks}= req.body;

    sqlQuery=`UPDATE mydb.enrolments SET Mark = ${marks} WHERE CourseID=${courseId} and UserID=${userId};`
    console.log(sqlQuery);
    try {
        await  db.promise().query(sqlQuery);
         res.status(200).send({msg:'Marks Updated successfully'});
        }
     catch (err){
          console.log(err);
     }
    
     }
  );


module.exports = router;