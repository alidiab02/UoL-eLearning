const { Router } = require('express');
const db = require('../database');

const router = Router();

// Get all courses from the db
router.get('/', async (req, res) => {
    //get all courses from the database
    try {
        courses = await db.promise().query(`SELECT * FROM mydb.courses where isAvailable=0 LIMIT 5 `);
        res.status(200).send(courses[0]);
        }
    catch (err){
        console.log(err);
    }
  });

module.exports = router;