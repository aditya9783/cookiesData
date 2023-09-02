let express = require("express");
//let cors= require("cors")
let app = express();

app.use(express.json());

//app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:3000');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
const port =2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

const cookieParser = require("cookie-parser");
app.use(cookieParser("abcdef-3477819"));

let {employees} = require("./data");

app.post("/login",function(req,res){
    let {empCode,name} = req.body;
    let emp1 = employees.find((emp)=>emp.empCode=== +empCode && emp.name===name);
    console.log(empCode,name);
    console.log(emp1);
    if(emp1){
        res.cookie("emp",{user:name,url:[]},{maxAge:1500000,signed:true});
        res.json({
            name:emp1.name,
            designation :emp1.designation
        })
    }
    else{
        res.status(401).send("Login Failed! Check EmpCode And Name Again")
    }
});

app.get("/myDetail/:name",function(req,res){
    let emp= req.signedCookies.emp;
    console.log(emp);
    let name= req.params.name;
    console.log(`emp is ${JSON.stringify(emp)}`);
    if(!emp) emp={user : "Guest" , url:[]};
    emp.url.push({url:`/myDetail/${name}`,date:Date.now()});
    res.cookie("emp",emp,{maxAge:1500000,signed:true});
    let emp1= employees.find((e)=>e.name=== name);
    res.send(emp1)
});

app.get("/junior/:designation",function(req,res){
    let designation= req.params.designation;
    let emp= req.signedCookies.emp;
    let emp1="";
    console.log(`emp is ${JSON.stringify(emp)}`);
    if(!emp) emp={user : "Guest" , url:[]};
    emp.url.push({url:`/junior/${designation}`,date:Date.now()});
    res.cookie("emp",emp,{maxAge:1500000,signed:true});
    if(designation==="VP"){
      emp1= employees.filter((e)=>e.designation=== "Manager" || e.designation==="Trainee");
    }
    if(designation==="Manager"){
        emp1= employees.filter((e)=>e.designation==="Trainee");
    }
    res.send(emp1)
});

app.get("/logout",function(req,res){
    console.log("In Delete");
    res.clearCookie("emp");
    res.send("Cookie Deleted")

});
app.get("/cookieData",function(req,res){
    let emp = req.signedCookies.emp;
    
    console.log("In Cookie Data",emp);
    res.send(emp)
  });