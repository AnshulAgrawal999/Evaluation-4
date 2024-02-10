const jwt = require( 'jsonwebtoken' )  ;

const auth = async ( req , res , next ) => {

    const token = req.headers.authorization  ;

        jwt.verify( token , 'prepleaf-masai', function(err, decoded) {

            if ( !err )
            {
                req.body.email = decoded.email  ;

                next()  ;
            }
            else
            {
                res.send( { "error" : err } )  ;
            }

        })  ;
} 

module.exports = { auth }  ;