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

//validate if teacher exists
async function userExists(userID) {
    query=`SELECT * FROM mydb.users Where UserID=${userID}`;
    let user = await db.promise().query(query)
    return await user;

};
//Get Teacher Role
async function getUserRole(roleId){
    query=`SELECT * FROM mydb.roles WHERE RoleID=${roleId}`;
    let role = await db.promise().query(query);
    return await role;
}


// Get all courses from the Database
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

// Method to assign a teacher to a course
router.put('/:id/assignteacher',[ check('requestorid').isInt().withMessage('Requestor ID needs to be numeric.'),
                    check('id').isInt().withMessage('Course ID needs to be numeric.'),
                    check('teacherId').isInt().withMessage('Teacher ID needs to be numeric.'),
                ],(req,res)=>
    {
        const { teacherId } = req.body;
        const { id }  = req.params;
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
                                if(role[0].RoleID===2){
                                    var sqlQuery=`UPDATE mydb.courses SET TeacherID = ${teacherId} WHERE CourseID=${id}`
                                    console.log(sqlQuery)

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
                                                    msg:`${id} - Course updated successfully.`,
                                                    time:new Date()
                                                });
                                            }
                                        });
                                } else {
                                    return res.status(400).json({
                                        errorCode:'400-004',
                                        errorMessage:`Role Error`,
                                        errorDetails:`Cannot assign this user ${teacherId} to the course.`,
                                        callId:uuid(),
                                        requestUserId:`${requestorid}`,
                                        apiVersion:`${apiVersion}`,
                                        time:new Date()
                                    })
                                }
                            },
                            (error)=>{
                                return res.status(400).json({
                                    errorCode:'400-004',
                                    errorMessage:`Role Error`,
                                    errorDetails:`User ${teacherId} role not defined.`,
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
                                errorDetails:`${teacherId} - Teacher not found.`,
                                callId:uuid(),
                                requestUserId:`${requestorid}`,
                                apiVersion:`${apiVersion}`,
                                time:new Date()
                            })
                        }
                    },
                    (error)=>{
                        res.status(400).send({
                            errorCode:'400-001',
                            errorMessage:`Object not found`,
                            errorDetails:`${teacherId} - Teacher not found.`,
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

// Method to update enable or disable the availability of a course
router.put('/:id/setstatus',[ check('requestorid').isInt().withMessage('Requestor ID needs to be numeric.'),
                    check('isAvailable').isIn(['0','1']).withMessage('Valid values are 0 and 1 (0-Not available and 1-Available)'),
                    check('id').isInt().withMessage('Course ID needs to be numeric.'),
                ],(req,res)=>
    {
        const { isAvailable , teacherId } = req.body;
        const { id }  = req.params;
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
            if (isAvailable){
                    var sqlQuery=`UPDATE mydb.courses SET isAvailable = ${isAvailable} WHERE CourseID=${id}`
                    db.query(sqlQuery,(err, result)=> {
                        if (err) {                                                                           console.log(err)
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
                                msg:`${id} - Course updated successfully.`,
                                time:new Date()
                            });
                        }
                    });
            } else {
                    res.status(400).send({
                        errorCode:'400-003',
                        errorMessage:`Missing required parameter`,
                        errorDetails:`${id} - Missing required parameter`,
                        callId:uuid(),
                        requestUserId:`${requestorid}`,
                        apiVersion:`${apiVersion}`,
                        time:new Date()
                    })
            };
        }
    })

module.exports = router;