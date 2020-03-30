//for secret key
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../db-models/user');
const People = require('../db-models/people');
const Session = require('../db-models/session');
const Upload = require('../storage/storage');
require('../db');

router.get('/', (req,res) => {
    res.send("hi i am api router");
});

router.get('/data', verifyToken,(req, res) => {
    User.find({},(err,resp) => {
        res.status(200).json( resp.filter(r => r.email === req.email.subject))
    })
});

router.delete('/logout', (req, res) => {
     //use this   req.body.token;
     const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoidXNlcnNAZ2cuY29tIiwiaWF0IjoxNTgwNTgxNzczfQ.tvxYb10UG3SO0XyKcG0TkviKsXJZy7rhAooSaq3RbvA"
    Session.findOneAndRemove({Refresh_session: refreshToken}, (err, resp) => {
        if (err) {
            res.status(401).send('unauthorised token');
        } else {
            res.status(204).send('removed');
        }
    });
})



router.post('/session', (req, res) => {
    //const refreshToken = req.body.token;
    const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoidXNlcnNAZ2cuY29tIiwiaWF0IjoxNTgwNTgxNzczfQ.tvxYb10UG3SO0XyKcG0TkviKsXJZy7rhAooSaq3RbvA"
    if (refreshToken === null) {
        res.status(401).send('unauthorised token');
    } else {
        Session.find({}, (err, resp) => {
            resp.filter(r => {
                if (Object.values(r).includes(refreshToken)) {
                    res.status(403).send('unauthorised token');
                } else {
                    jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN, (err, user) => {
                    if (err) {
                        res.status(403).send('unauthorised token');
                    } else {
                        const accessToken = createToken({subject: user.email});
                        res.status(200).send({accessToken});
                    }
                    });
                }
            });
        })
        // if (!refreshTokens.includes(refreshToken)) {
        //     res.status(403).send('unauthorised token');
        // } else {
        //     jwt.verify(refreshToken, process.env.REFRESH_SECRET_TOKEN, (err, user) => {
        //         if (err) {
        //             res.status(403).send('unauthorised token');
        //         } else {
        //             const accessToken = createToken({subject: user.email});
        //             res.status(200).send({accessToken});
        //         }
        //     });
        // }
    }
    
});

router.post('/register',(req, res) => {
   // const regData = req.body;
   // const userDetail = new User(regData);
    const userDetail = new User({
        firstname: "test",
        lastname: "data",
        email: "users@gg.com",
        password: "12345",
        contact: "020-87373737"
    });

    const userEmail = {subject: userDetail.email}
    const accessToken = createToken(userEmail);
    const refreshToken = jwt.sign(userEmail, process.env.REFRESH_SECRET_TOKEN);
    
    const RefSession = new Session({Refresh_session: refreshToken});
    RefSession.save((err, sess) => {
        if (err) {
            throw err;
        } else{
            userDetail.save((err, resgisterUser) => {
                console.log("yyyyyyyyyyyyyyyyyy...")
                if (err) {
                    throw err;
                } else{
                    console.log(resgisterUser.firstname)
                    res.status(200).send({accessToken, refreshToken});
                }
            });
        }
    });
    
    
   
});

router.post('/login',(req, res) => {
    // const loginData = req.body;

     const loginData = {
        email: "rr@gg.com",
        password: "12345"
     }

    const userEmail = {subject: loginData.email}
    const accessToken = createToken(userEmail);
    const refreshToken = jwt.sign(userEmail, process.env.REFRESH_SECRET_TOKEN);

     User.findOne({email: loginData.email}, (err, user) => {
         if (err) {
            console.log('ghh999');
             throw err;
         } else{ 
             if (!user) {
                 res.status(401).send('unauthorised');
             } else {
                
                 if(user.password !== loginData.password) {
                    res.status(401).send('wrong password');
                 } else {
                    res.status(200).send({accessToken, refreshToken});
                 }
             }
         }
     });
    
 });

 router.get('/people', paginatedData(People), (req, res) => {
    // People.find({},(err,resp) => {
    //     res.status(200).send(resp)
    // })
    res.status(200).json(res.filteredRecords)
});

//middlewares


function paginatedData(model) {
    return async(req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        let result = {};

       // if (endIndex < model.length) {
        if (endIndex < await model.countDocuments().exec()) {
            result.next = {
                page: page +1,
                limit: limit
            }
    
        }
        
        if (startIndex > 0) {
            result.prev = {
                page: page - 1,
                limit: limit
            }
        }
        

       // result.data = model.slice(startIndex, endIndex); with static data
       try {
        result.data = await model.find().limit(limit).skip(startIndex).exec();

        res.filteredRecords = result;
       }
       catch(e) {
           res.status(500).json({message: e.message});
       }

       next();
    }
}

function createToken(payload) {
    //expire if want to refreash
    return jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, {expiresIn: '30s'});
}

function verifyToken(req, res, next) {
    if( !req.headers['authorization'] ) {
        res.status(401).send('unauthorised header');
    } else {
        const authHeader = req.headers['authorization'];
        console.log("TCL: verifyToken -> authHeader", authHeader)
        const token = authHeader && authHeader.split(' ')[1];
        console.log("TCL: verifyToken -> token", token)

    if (token === null) {
        res.status(401).send('token null');
    } else {
        console.log("TCL: verifyToken -> token", token)
        jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (err, user) => {
        console.log("TCL: verifyToken -> user", user)
            if (err) {
                res.status(403).send('unauthorised token');
            } else {
                req.email = user;
               // next()
            }
            next()
        });
    }
    }
}


//uploads
router.post('/uploadone', Upload.single('aanfile'), (req, res, next) => {
    let file = req.file;
    if (!file) {
        res.status(400).send('error');
    } else {
        res.status(200).send('file saved');
    }
})


module.exports = router;