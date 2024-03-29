const express = require( 'express' )  ;

const userRouter = express.Router()  ;

const { UserModel } = require( '../models/userModel' )  ;

const bcrypt = require( 'bcrypt' ) ;

const jwt  = require( 'jsonwebtoken' )  ;

const { BlackListModel } = require( '../models/blackList' )  ;

userRouter.post( '/register' , async ( req , res ) => {

    try {

        const { name , email , gender , password } = req.body  ;

        const user = await UserModel.findOne( { email } )  ;

        if( !user )
        {
                bcrypt.hash( password , 5 , async function(err, hash) {
                    if( err )
                    {
                        res.send( { "error" : err } )  ;
                    }
                    else
                    {
                        const newuser = new UserModel( { name , email , gender , "password" : hash } )  ;

                        await newuser.save()  ;

                        res.status(200).send( { "msg" : "The new user has been registered", newuser } )  ;
                    }
                })  ;
        }
        else
        {
            res.send( { "msg" : "Email is unavailable( already taken )" } )  ;
        }

        
    } catch (error) {
        res.status(400).send( { "error" : error } )  ;
    }
} )  ;


userRouter.post( '/login' , async ( req , res )=>{

    try {
        const { email , password  } = req.body  ;

        const user = await UserModel.findOne( { email } )  ;

        if( user )
        {
            bcrypt.compare( password , user.password , function(err, result) {
                if( err )
                {
                    res.send( { "error" : err } )  ;
                }

                if( result )
                {
                    const token = jwt.sign( { email } , 'prepleaf-masai' )  ;

                    res.status(200).send( {"msg":"Login successful!", token } )  ;
                }
                else
                {
                    res.send( { "msg" : "Password is incorrect" } )  ;
                }
            });
        }
        else
        {
            res.send( { "msg" : "Email is incorrect" } )  ;
        }

    } catch (error) {
        res.status(400).send( { "error" : error } )  ;
    }
} )  ;

userRouter.get( '/logout' , async ( req , res ) => {
    try {
        const token = req.headers.authorization  ;

        const item = new BlackListModel( { token } )  ;

        await item.save()  ;

        res.status(200).send( {"msg":"User has been logged out" }  )  ;
        
    } catch (error) {
        res.status(400).send( { "error" : error } )  ;
    }
} )   ;



module.exports = { userRouter }  ;