const express = require( 'express' )  ;

const app = express()  ;

const { connection } = require( './db' )  ;

const dotenv = require( 'dotenv' )  ;

dotenv.config() ;

const { userRouter } = require( './routes/userRoutes' )  ;

const { auth } = require( './middleware/auth' )  ;

const { PostModel } = require( './models/postModel' )  ;

const port = process.env.port  ;

const cors = require( 'cors' )  ;

app.use( cors() )  ;

app.use( express.json() )  ;

app.use( '/users' , userRouter )  ;


app.get( '/' , ( req , res )=>{
    
    res.status(200).send( { "msg" : "this is the home page of my posts app"} )  ;
    
} )  ;


app.post( '/posts/add' , auth , async ( req , res )=>{

    try {
        
        const post = new PostModel( req.body )  ;

        await post.save()  ;

        res.status(201).send( {"msg":"Post added", post } )  ;

    } catch (error) {
        res.status(400).send( {error} )  ;
    }
} )  ;

app.get( '/posts' , auth , async ( req , res )=>{

    try {

        const device = req.query.device  ;

        const posts = await PostModel.find( { 'email' : req.body.email , device } )  ;

        res.status(200).send( posts )  ;

    } catch (error) {
        res.status(400).send( {error} )  ;
    } 
} )  ;

app.patch( '/posts/update/:id' , auth , async ( req , res )=>{

    try {

        const id = req.params.id  ; 

        await PostModel.updateOne( { 'email' : req.body.email , '_id' : id } , req.body )  ;

        res.status(201).send( {"msg":"Post has been updated"} )  ;

    } catch (error) {
        res.status(400).send( {error} )  ;
    }
} )  ;

app.delete( '/posts/delete/:id' , auth , async ( req , res )=>{
    
    try {
        const id = req.params.id  ; 

        await PostModel.deleteOne( { 'email' : req.body.email , '_id' : id } )  ;

        res.status(200).send( {"msg":"Post has been deleted"} )  ;

    } catch (error) {
        res.status(400).send( {error} )  ;
    }
} )  ;


app.listen( port , async ()=>{

    try {
        console.log( 'server is running on http://localhost:4500' )  ;

        await connection ;

        console.log( 'server is connected to db' )  ;
    } catch (error) {
        console.log( error ) ;
    }
})  ;