const jwt = require('jsonwebtoken')
const secret = require('./keys').JWT_SECRET;
const clientSecret = require('./keys').CLIENT_SECRET



const getToken = (user) => {
        return jwt.sign({name:user.name,
                         email:user.email     
        },secret,{expiresIn: '24h'}
        )}

const isAuth = (req,res,next) => {
        const token = req.headers.authorization;
        if(token) {
                const onlyToken = token.slice(7,token.length);
                console.log(onlyToken);
                jwt.verify(onlyToken,secret,(err,decode) => {
                        if(err) return res.status(401).json({msg:'Invalid token'})
                        req.user = decode;
                        next();
                        return;
                });
        }
        else {
                return res.status(401).json({msg:'token not supplied'});
        }

}

module.exports = {
        getToken,
        isAuth
}