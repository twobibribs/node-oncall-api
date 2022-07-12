var express = require("express")
var jwt = require('jsonwebtoken');
var app = express()
var db = require("./database.js")
var md5 = require("md5")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

app.get("/api/oncall", verifyToken,(req, res, next) => {
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err){
            console.log(err)
            res.sendStatus(403);
        }
        else{
            var sql = "select * from oncall"
            var params = []
            db.all(sql, params, (err, rows) => {
                if (err) {
                res.status(400).json({"error":err.message});
                return;
                }
                res.json({
                    "message":"success",
                    "data":rows
                })
            });
        }
    });
});

app.post('/api/login',(req,res)=>{

    const user = {
        id:Date.now(),
        userEmail:'does@not.exist',
        password:'notarealpassword1!'
    }

    //send abpve as payload
    jwt.sign({user},'secretkey',(err,token)=>{
        res.json({
            token
        })
    })
})

app.get("/api/oncall/:id", verifyToken,(req, res, next) => {
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
            res.sendStatus(403);
        else{
            var sql = "select * from oncall where tenant = ?"
            var params = [req.params.id]
            db.get(sql, params, (err, row) => {
                if (err) {
                res.status(400).json({"error":err.message});
                return;
                }
                res.json({
                    "message":"success",
                    "data":row
                })
            });
        }
    });
});


app.post("/api/oncall/", verifyToken,(req, res, next) => {
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
            res.sendStatus(403);
        else{
            var errors=[]
            if (!req.body.tenant){
                errors.push("No tenant specified");
            }
            if (!req.body.email){
                errors.push("No email specified");
            }
            if (errors.length){
                res.status(400).json({"error":errors.join(",")});
                return;
            }
            var data = {
                name: req.body.name,
                email: req.body.email,
                tenant : req.body.tenant
            }
            var sql ='INSERT INTO oncall (name, email, tenant) VALUES (?,?,?)'
            var params =[data.name, data.email, data.tenant]
            db.run(sql, params, function (err, result) {
                if (err){
                    res.status(400).json({"error": err.message})
                    return;
                }
                res.json({
                    "message": "success",
                    "data": data,
                    "id" : this.lastID
                })
            });
        }
    });
})



app.patch("/api/oncall/:id", verifyToken,(req, res, next) => {
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
            res.sendStatus(403);
        else{
            var data = {
                name: req.body.name,
                email: req.body.email,
                tenant : req.body.tenant 
            }
            db.run(
                `UPDATE oncall set 
                name = coalesce(?,name), 
                email = COALESCE(?,email), 
                tenant = coalesce(?,tenant) 
                WHERE id = ?`,
                [data.name, data.email, data.tenant, req.params.id],
                (err, result) => {
                    if (err){
                        res.status(400).json({"error": res.message})
                        return;
                    }
                    res.json({
                        message: "success",
                        data: data
                    })
            });
        }
    });
})


app.delete("/api/oncall/:id",verifyToken, (req, res, next) => {
    jwt.verify(req.token,'secretkey',(err,authData)=>{
        if(err)
            res.sendStatus(403);
        else{
            db.run(
                'DELETE FROM oncall WHERE id = ?',
                req.params.id,
                function (err, result) {
                    if (err){
                        res.status(400).json({"error": res.message})
                        return;
                    }
                    res.json({"message":"deleted", rows: this.changes})
            });
        }
    });
})

function verifyToken(req,res,next){
    //Auth header value = > send token into header
    console.log(req.headers)
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){

        //split the space at the bearer
        const bearer = bearerHeader.split(' ');
        //Get token from string
        const bearerToken = bearer[1];

        //set the token
        req.token = bearerToken;

        //next middleweare
        next();

    }else{
        //Fobidden
        res.sendStatus(403);
    }
}

// Root path
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

