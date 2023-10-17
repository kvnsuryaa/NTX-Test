const db = require("../models");
const jwt = require("jsonwebtoken");
const User = db.user;

exampleMiddlewareFunction = async (req, resp, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return resp.status(403).send({
      success: false,
      statusCode: 403,
      data: {},
    });
  }

  let token = auth.split(" ");
  if (token.length == 1) {
    console.log("Please using Bearer");
    return resp.status(403).send({
      success: false,
      statusCode: 403,
      data: {},
    });
  }

  token = token[1];
  const verify = jwt.verify(token, process.env.SECRET || "SECRET");
  const userId = verify.id;
  const workType = verify["workType"];

  // checking for user
  const user = await User.findOne({
    where: {
      id: userId,
    },
  });

  if (!user) {
    console.log("User not found");
    return resp.status(403).send({
      success: false,
      statusCode: 403,
      data: {},
    });
  }

  if (workType !== "WFO") {
    console.log("Work Type not WFO, means not have access to the API");
    return resp.status(403).send({
      success: false,
      statusCode: 403,
      data: {},
    });
  }

  next();
};

const verify = {
  exampleMiddlewareFunction: exampleMiddlewareFunction,
};

module.exports = verify;
