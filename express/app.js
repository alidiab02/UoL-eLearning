
const express = require('express');
const cookieParser = require('cookie-parser');
//Courses APIs
const courseRoute = require('./routes/course');

//Middlewares
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Logger - Log incoming requests on the console using use middleware.
app.use((req,res, next)=>{
    console.log(`${req.method} - ${req.url}`);
    next();
});

const apiVersion = 1;
var courses = 1;

app.get('/api/status', function (req, res) {
    res.send(
        {
            msg: 'This is e-Learning API application developed for University of Liverpool',
            status: `Server is running at port number : ${port}`
        }
    )
  });

app.use('/api/courses',courseRoute)


//set environment parameter using terminal command for mac - Export PORT=3003
const port = process.env.PORT || 3000
app.listen(port,()=>console.log(`Listening on port ${port}...`));



