const { Router } = require('express');
const db = require('../database');

const router = Router();
const { check, validationResult } = require('express-validator');
const apiVersion = 1.0

//Generate Call ID
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=> {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

//Check if the input is numeric
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

//validate if teacher exists
async function userExists(userID) {
  query=`SELECT * FROM mydb.users Where UserID=${userID}`;
  let user = await db.promise().query(query)
  return await user;

};
//Get teacher Role
async function getUserRole(roleId){
  query=`SELECT * FROM mydb.roles WHERE RoleID=${roleId}`;
  let role = await db.promise().query(query);
  return await role;
}

//Get one course
async function getCourseDetail(query){
  let course= await db.promise().query(query);
  return await course;
}

// Teacher pass or fail student in a course
router.put('/teacher/:id',[ check('requestorid').isInt().withMessage('Requestor ID needs to be numeric.'),
                    check('studentId').isInt().withMessage('Student ID needs to be numeric.'),
                ],(req,res)=>
     {
          const {userId} = req.params;
          const {courseId} = req.params;
          const{marks}=req.params;
          const { requestorid } = req.headers;
          
          const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({
                errorCode:'400-002',
                errorMessage:`Invalid format or value`,
                errorDetails:errors.array(),
                callId:uuid(),
                requestUserId:`${requestorid}`,
                apiVersion:`${apiVersion}`,
                time:new Date()
            })
          }

          if (id&&requestorid){
               if (teacherId){
                   userExists(teacherId).then(
                       (result)=> {
                           user = result[0]
                           if(user.length>0){
                               getUserRole(user[0].RoleID).then(
                                   (result)=> {
                                       role = result[0]
                                       if(role.length>0){
                                           if(role[0].RoleID===2){
                                               var sqlQuery=`UPDATE mydb.enrolments SET Mark = ${marks} WHERE CourseID=${courseId} and UserID=${userId};`
                                               db.query(sqlQuery,(err, result)=> {
                                                   if (err) {
                                                       console.log(err)
                                                       return res.status(500).json({
                                                           errorCode:'500-002',
                                                           errorMessage:`Database Connection Error`,
                                                           errorDetails:err.array(),
                                                           callId:uuid(),
                                                           requestUserId:`${requestorid}`,
                                                           apiVersion:`${apiVersion}`,
                                                           time:new Date()
                                                       });
                                                   };
                                                   if (result.affectedRows===0){
                                                       res.status(400).send({
                                                           errorCode:'400-001',
                                                           errorMessage:`Object not found`,
                                                           errorDetails:`${id} - Course not found.`,
                                                           callId:uuid(),
                                                           requestUserId:`${requestorid}`,
                                                           apiVersion:`${apiVersion}`,
                                                           time:new Date()
                                                       })
                                                   }else{
                                                       console.log(result.affectedRows + " record(s) updated");
                                                       res.status(200).send({
                                                           errorCode:'000-000',
                                                           callId:uuid(),
                                                           requestUserId:`${requestorid}`,
                                                           apiVersion:`${apiVersion}`,
                                                           msg:`${id} - ${StudentId} get ${marks} in course ID:${courseId}.`,
                                                           time:new Date()
                                                       });
                                                   }
                                               });
                                           } else {
                                               return res.status(400).json({
                                               errorCode:'400-004',
                                               errorMessage:`Role Error`,
                                               errorDetails:`Cannot add Grade.`,
                                               callId:uuid(),
                                               requestUserId:`${requestorid}`,
                                               apiVersion:`${apiVersion}`,
                                               time:new Date()
                                               })
                                           }
                                       } else {
                                           return res.status(400).json({
                                               errorCode:'400-004',
                                               errorMessage:`Role Error`,
                                               errorDetails:`User ${teacherId} role not defined.`,
                                               callId:uuid(),
                                               requestUserId:`${requestorid}`,
                                               apiVersion:`${apiVersion}`,
                                               time:new Date()
                                           })
                                       }
                                   },
                                   (error)=>{
                                       res.status(500).send({
                                           errorCode:'500-001',
                                           errorMessage:`Server Error`,
                                           errorDetails:`${requestorid} - Internal Server Error.`,
                                           callId:uuid(),
                                           requestUserId:`${requestorid}`,
                                           apiVersion:`${apiVersion}`,
                                           time:new Date()
                                       })
                                   },
                               )
                           } else {
                               res.status(400).send({
                                   errorCode:'400-001',
                                   errorMessage:`Object not found`,
                                   errorDetails:`${teacherId} - teacher not found.`,
                                   callId:uuid(),
                                   requestUserId:`${requestorid}`,
                                   apiVersion:`${apiVersion}`,
                                   time:new Date()
                               })
                           }
                       },
                       (error)=>{
                           res.status(500).send({
                               errorCode:'500-001',
                               errorMessage:`Server Error`,
                               errorDetails:`${requestorid} - Internal Server Error.`,
                               callId:uuid(),
                               requestUserId:`${requestorid}`,
                               apiVersion:`${apiVersion}`,
                               time:new Date()
                           })
                       }
                   );
               }
   
           } else{
               res.status(400).send({
                   errorCode:'400-003',
                   errorMessage:`Missing required parameter`,
                   errorDetails:`${id} - Missing required parameter`,
                   callId:uuid(),
                   requestUserId:`${requestorid}`,
                   apiVersion:`${apiVersion}`,
                   time:new Date()
               });
           }
       });
       module.exports = router;




































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