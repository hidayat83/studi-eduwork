const bcrypt = require('bcrypt');
const User= require('../user/model');
const passport= require('passport');
const jwt=require('jsonwebtoken');
const  config  = require('../config');

const register= async(req,res,next)=>{
    try {
        const payload=req.body
        let user= new User(payload);
        await user.save();
        return res.json(user)
    } catch (err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error:1,
                message:err.message,
                fields:err.errors
            })
        }
        next(err)
    }
} 

const localStrategy =async (email,password,done)=>{
    try {
        let user =
        await User.findOne({email}).select('-__v -createdAt -updateAt -cart_items -token');
        if(!user)return done();
        if(bcrypt.compareSync(password,user.password)){
            ({password, ...userWithoutPassword } = user.toJson() );
            return done(null, userWithoutPassword);
        }
    } catch (err) {
        done(err, null)
    }
    done();
}

const login= async(req,res,next)=>{
    passport.authenticate('local',async function(err,user){
        if(err) return next(err)
        if(!user) return res.json({error: 1, message:' Email or Password Correct'});

        let signed = jwt.sign(user, config.secretkey);

        await User.findByIdAndUpdate(user._id, {$push:   {token: signed}});

        res.json({
            message: 'Login Successfully',
            user,
            token: signed
        })
    })(req, res, next)
} 

module.exports={
    register,
    localStrategy ,
    login  
}