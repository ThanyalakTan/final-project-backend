const UserModel = require("../user-schema");
const jwt = require('jsonwebtoken');

const verifyAuth = async (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  if(bearerHeader !== undefined) {
    const bearer = bearerHeader.split(' ');
    // console.log(bearer);
    const bearerToken = bearer[1];
    req.token = bearerToken;

    const verifyResult = verifyToken(bearerToken)
    const findUserId = await UserModel.findOne({ _id: verifyResult.id })
    if(!findUserId){
      return res.sendStatus(403)
    }
    req.userId = verifyResult.id;
    next();
  }
}

const verifyToken = (token) => {
  return jwt.verify(token, process.env.mySecret, (err, authData) => {
    if(err){
      return err;
    } else {
      return authData;
    }
  })
}

module.exports = verifyAuth;
