const express = require("express");

var cookieParser = require('cookie-parser');
const {OAuth2Client} = require('google-auth-library');
//your google client key. You can get it in the "OAuth2 credantails" in the google console  
const CLIENT_ID = '23739417343-t6l2fuemo568985e7i1btkodsp5s590d.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);

const app =express();
const port = process.env.PORT || 5000;

app.set("view engine","ejs");
app.use(express.json());
app.use(cookieParser());



///the middleware for authorization a user
const checkAuthenticated = async (req, res, next) =>{
  
        try{ 
                let token = req.cookies["session-token"];
                let user={};
                let ticket;
                //verifying the token
                ticket = await client.verifyIdToken({
                                idToken: token,
                                audience: CLIENT_ID, 
                            });
                    //decode payload of the JWT            
                const payload = ticket.getPayload();
                user.name = payload.name;
                user.email = payload.email;
                user.picture = payload.picture;
                res.cookie("session-token", token);
                req.user = user;
                console.log(user);     
                next();

        } catch(e) {
            res.redirect("/login");
        }
}

app.get("/",(req,res)=>{
    res.render("index");
});
 ///protected route.You can`t enter to the page if you have not been authorized before
 //the middleware function "checkAuthenticated" control your LogIn status firstly:
 //when a user in system - executes the next code  
app.get("/dashboard", checkAuthenticated, (req,res)=>{
    let user = req.user;
   res.render("dashboard",{user});
})


app.get("/logout",(req, res)=>{
    res.clearCookie("session-token");
    res.redirect("/login");
})

app.get("/login",(req,res)=>{
    res.render("login");
})


app.post("/login", async (req, res)=>{
    //  3) retrive a token from frontend goggle page  
   let token = req.body.token;
   let user={};
   
        async function verify () {
            const ticket = await client.verifyIdToken({
                        idToken: req.body.token,
                        audience: CLIENT_ID,  
                    });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            user.name = payload.name;
            user.email = payload.email;
            user.picture = payload.picture;
            console.log(payload);
        }
        //4) veryfy JWT from google
       verify()
       .then(()=>{
        //when a token is valid:
        //5) assign a JWT to a cookie
           res.cookie("session-token", token);
           res.statusCode = 200;
           res.json({status: true});
       }).catch(err=>res.redirect("/login"));


   
})


app.listen(port, ()=>{
    console.log(`Server listen on port ${port}`);
})