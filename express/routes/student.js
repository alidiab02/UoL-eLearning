const { Router } = require('express');
const db = require('../database');

const router = Router();

// Post API
router.post('/', async (req, res) => {
    //student enrol in a course
    const {userId} = req.body;
    const {courseId} = req.body;
    console.log(req.body);
    sqlQuery=`INSERT INTO mydb.enrolments (CourseID,UserID) VALUES ('${courseId}','${userId}')`
    console.log(sqlQuery);
    try {
         db.promise().query(sqlQuery);
         res.status(200).send({msg:'Course added successfully'});
        }
     catch (err){
          console.log(err);
     }
  });


module.exports = router;