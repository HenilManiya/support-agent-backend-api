// const { checkToken } = require("../../user-service/controllers/user.controllers");

const { responseLib, jwt, log } = require("../utils/lib");


module.exports.middleware = {
  auth: async function (req, res, next) {
    let token = req.header("x-auth-token");
    console.log(token,"tokentokentoken")
    const errorObj = {
      message: "token missing in header Authorization",
      statusCode: 401,
    };
    const errorObj1 = {
      message: "Password Changed",
      statusCode: 401,
    };

    if (!token) return responseLib.handleError(errorObj, res);
    try {
      console.log(token,"zcdzbhjzbbb")
      const decodedData = jwt.decodeToken(token);
      console.log(decodedData,"decodedDatadecodedData")
      console.log(decodedData.id,"decodedData.iddecodedData.iddecodedData.id")
      if (decodedData.id) {
        // checkToken(token, decodedData);
        // let currentUser = await req.db.User.findOne({ _id: decodedData.id
        //   // , token: { $ne: null } 
        //   }
        // );
        // console.log(currentUser,"currentUsercurrentUser")
        // if (currentUser && currentUser.token !== token) {
        //   return responseLib.handleError(errorObj1, res);
        // }

        // Add user from payload
        req.user = decodedData;
        return next();
      }

      return responseLib.handleError(errorObj, res);
    } catch (error) {
      const errorObj = {
        message: "failed to parse the token in header x-auth-token",
        statusCode: 401,
      };
      return responseLib.handleError(errorObj, res);
    }
  }
}

