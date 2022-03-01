
// const {Router} = require('express');
// const { append } = require('express/lib/response');

const router = require("./course");

// const db = require('../database.js');

// const router = Router();


// //API router to get list of all courses
// router.get('/api/courses/', function (req, res) {
//   res.format({
//       html: function(){
//         res.send('<H1>'+ 'HTML return' + '</H1>');
//       },

//       text: function(){
//         res.send('Text format input');
//       },

//       json: function(){
//         res.json(courses);
//       }
//     });


//   res.send('[1,2,3,4]');
// });

// //API router to get detail of 1 course
// router.get('/api/1/courses/:id', function (req, res) {
//   let courseId=parseInt(req.params.id);
//   if (!courseId) return res.status(404).send(`Invalid Data Type:  Course ID - ${req.params.id}`) //course id not numeric
//   res.status(200).send('Course ID valid')
// });
// router.get('/api/2/courses/:id', function (req, res) {
//   res.send(req.params.id);
// });
// router.get('/api/3/courses/:id', function (req, res) {
//   res.send(req.query);
// });
// router.get('/api/4/courses/:id', function (req, res) {
      // const {authorization} =  req.headers;
      // if (authorization && authorization === '123'){
      //     res.status(200).send(req.headers)
      //     return;
      // } else {
      //   res.status(403).send('forbidden');
      //   return;
      // }

//
// });

// router.post('/api/p1/courses', function(req,res){
// //code block
//   //Body validations using joi - Refer to joi APIs https://www.npmjs.com/package/joi
//   const schema = {
//       title: Joi.string().min(3).required()
//   };
//   const result = Joi.validate(req.body.title,schema)
//   console.log(result)

//   If (result.error){
//       res.status(400).send(result.error.details[0].message); // You can loop through the error object and concatenate all messages
//       return;
//   }


//   //Body validations manual
//   if(!req.body.title || req.body.title.length < 3){
//       res.status(400).send(`Title is required and should be more than 3 characters - ${req.body.title}`)
//   }

//   const courseTitle = req.body.title
//   //send to server
//   res.send(courseTitle)
// });

// router.put('/api/p1/courses/:id', function(req,res){
// //Look up the course

// // If not existing, return 400 - Bad request
//   //const result = validateCourse(req.body) // object destructuring - use result.error directly
//   const {error} = validateCourse(req.body)
//   If (result.error){
//       res.status(400).send(result.error.details[0].message); // You can loop through the error object and concatenate all messages
//       return;
//   }

// //if exists, update the course
// //return updated course to the client
// });

// function validateCourse(course){
//   const schema = {
//       title: Joi.string().min(3).required()
//   };
//   return Joi.validate(req.body.title,schema)
// }

//
// database interactions -
//
// database POST interactions -
// try {
//   db.promise().query(`INSERT INTO Courses VALUES('${title}','${isAvailable}','${teacher}')`);
//   res.status(200).send({msg:'Course added successfully'});
// }
// catch (err){
//   console.log(err);
// }
//
//creation of custom middleware -
// function validateAuthUser(req,res,next){
//   console.log('inside validate user');
//   const {authuser} = req.headers;
//   if (authuser && authuser == '123'){
//     next();
//   } else{
//     res.status(403).send({
//       msg:'Forbidden. Invalid user'
//     });
//   }
// }

// router.post('/courses',validateAuthUser,(req,res) => {
//   const course = req.body;
//   course.push(course);
//   res.status(201).send({msg:'course added successfully',couse:course})
// })
//
//Validate if each input request has a cookie - express-session package can be used for managing session id
// function validateCookie(req,res,next){
//   const {cookies} = req;
//   if ('session_id' in cookies){
//     console.log('session id exists');
//     if (cookies.session_id === '1234'){
//       next();
//     }else {
//       res.status(403).send({msg:'user not authenticated'})
//     }
//   }else {
//     res.status(403).send({msg:'user not authenticated'})
//   }

// }
// //set cookie on the response of signin
// router.get('/signin',(req,res) => {
//   res.cookie('session_id','1234');
//   res.status(200).json({msg: 'user logged in'})
// })
// //check cookie on the request of access to protected resource
// router.get('/protected',validateCookie,(req,res) => {
//   res.cookie('session_id','1234');
//   res.status(200).json({msg: 'you are authorized.'})
// })

// No async call for post or put method.
// router.post('/',(req,res)=> {
//       const {username, password } =req.body;
//       if (username&&password){
//             try {
//                   db.promise().query(`INSERT INTO Courses VALUES('${title}','${isAvailable}','${teacher}')`);
//                   res.status(200).send({msg:'Course added successfully'});
//                   }
//             catch (err){
//                   console.log(err);
//             }
//
//       }
// });
// console.log("=====")
// console.log(datetime);
// console.log("=====")
// console.log(new Date().toISOString().replace('T', ' ').substring(0, 19))
// console.log("=====")
// // other formats
// console.log(new Date().toUTCString())
// console.log("=====")
// console.log(new Date().toLocaleString('en-US'))
// console.log("=====")
// console.log(new Date().toString())
// console.log("=====")
// module.exports = router;
