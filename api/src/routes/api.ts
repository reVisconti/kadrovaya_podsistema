import { Router } from "express";
import * as apiCtrl from "../contollers/contollers";
import { addPosition, managers } from "../contollers/contollers";

// Export the base-router
const baseRouter = Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const TOKEN_KEY = process.env.TOKEN_KEY;
// Setup routers

baseRouter.route("/registration").post(apiCtrl.addUser);
baseRouter.route("/auth").post(apiCtrl.auth);

baseRouter.use((req, res, next) => {
  if (req.headers.authorization) {
    let token = req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, TOKEN_KEY, function (err: Error) {
      if (err == null) {
        next();
      } else {
        res.status(500).send(err);
      }
    });
  } else {
    res
      .status(500)
      .json({ success: false, errors: { messages: "unauthorized" } });
  }
});

baseRouter.route("/role").post(apiCtrl.role);
baseRouter.route("/createStatement").post(apiCtrl.createStatement);
baseRouter.route("/cancelStatement").post(apiCtrl.cancelStatement);
baseRouter.route("/revokeStatement").post(apiCtrl.revokeStatement);
baseRouter.route("/agreeStatement").post(apiCtrl.agreeStatement);

baseRouter.route("/statements").get(apiCtrl.getStatementList);
baseRouter
  .route("/subordinateStatements")
  .get(apiCtrl.getSubordinateStatements);

baseRouter.route("/admin/users").get(apiCtrl.getUsers);
baseRouter.route("/admin/documents").get(apiCtrl.getDocuments);
baseRouter.route("/admin/addPosition").post(apiCtrl.addPosition);
baseRouter.route("/admin/positions").get(apiCtrl.positions);
baseRouter.route("/admin/managers").get(apiCtrl.managers);

baseRouter.route("/admin/changeUserData").post(apiCtrl.changeUserData);
//baseRouter.route('/admin/changeStatementData').post(apiCtrl.changeStatementData);

// Export default.
export default baseRouter;
