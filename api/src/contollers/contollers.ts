import {
  getDatabase,
  getStatement,
  getSubordinates,
  getUserID,
  getUserName,
  IUser,
  Role,
  setStatementStatusByManager,
  StatementStatus,
  StatementType,
} from "../utils/database";
import {
  checkValidDomainEmail,
  checkValidEmail,
  parseUserFromJWT,
} from "../utils/utils";
import moment from "moment";
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const TOKEN_KEY = process.env.TOKEN_KEY;

export const role = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    console.log(user);
    let db = getDatabase();
    db.users.loadDatabase();
    db.users.findOne({ email: user }, function (err, doc) {
      if (err == null) {
        return res.status(200).send({
          success: "true",
          role: doc.role,
        });
      } else {
        res
          .status(500)
          .json({ success: false, errors: { messages: "Error on server" } });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};
export const addUser = async (req, res) => {
  try {
    let db = getDatabase();
    let email = req.body.email;
    let password = req.body.password;
    let fullName = req.body.fullname;
    let position = req.body.position;
    let roles = req.body.roles;
    let directorID = req.body.directorID ? req.body.directorID : null;
    if (!email || !checkValidEmail(email) || !checkValidDomainEmail(email)) {
      return res.status(400).send({
        success: "false",
        message: "email is not valid",
      });
    }

    if (!password) {
      return res.status(400).send({
        success: "false",
        message: "password is required",
      });
    }

    db.users.loadDatabase();
    db.users.findOne({ email: email }, function (err, doc) {
      if (err === null && doc === null) {
        bcrypt.hash(password, 10).then(function (hash) {
          let user: IUser = {
            id: uuid.v4(),
            email: email,
            password: hash,
            fullName: fullName,
            position: position,
            role: roles,
            directorID: directorID,
          };
          db.users.insert(user);
          console.log(`Create user: ${email}`);
          return res.status(200).send({
            success: "true",
          });
        });
      } else {
        return res.status(500).send({
          success: "false",
          message: "email already used",
        });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const auth = async (req, res) => {
  try {
    let db = getDatabase();
    let email = req.body.email;
    if (!email) {
      return res.status(400).send({
        success: "false",
        message: "email is required",
      });
    }
    let password = req.body.password;
    if (!password) {
      return res.status(400).send({
        success: "false",
        message: "password is required",
      });
    }
    db.users.loadDatabase();
    db.users.findOne({ email: email }, function (err, doc) {
      if (err == null && doc !== null) {
        bcrypt.compare(password, doc.password).then(function (result) {
          if (result) {
            console.log(`Auth user: ${email}`);
            return res.status(200).json({
              email: email,
              token: jwt.sign({ email: email }, TOKEN_KEY),
            });
          } else {
            return res.status(500).send({
              success: "false",
              message: "invalid password",
            });
          }
        });
      } else {
        return res.status(500).send({
          success: "false",
          message: "user not found",
        });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const createStatement = async (req, res) => {
  try {
    let type =
      req.body.type || req.body.type == 0 ? parseInt(req.body.type) : null;
    let startDate = req.body.startDate
      ? moment(req.body.startDate, "YYYY-MM-DD")
      : null;
    let countDay = req.body.countDay ? parseInt(req.body.countDay) : null;
    if (!startDate || !countDay) {
      return res.status(500).json({
        success: false,
        errors: { messages: "enter required argument" },
      });
    }
    let [dateFollowedWork, vacationSpot] = [null, null];
    dateFollowedWork = req.body.dateFollowedWork
      ? req.body.dateFollowedWork
      : null;
    vacationSpot = req.body.vacationSpot ? req.body.vacationSpot : null;

    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let db = getDatabase();
    db.statements.loadDatabase();
    db.statements.insert({
      type,
      user,
      status: StatementStatus.awaitingApproval,
      startDate: startDate.unix(),
      countDay,
      dateFollowedWork: moment(dateFollowedWork, "YYYY-MM-DD").unix(),
      vacationSpot,
    });
    console.log(`Create statement by ${user}`);
    //console.log(type, startDate, countDay, startDate.add(countDay, 'd'))
    return res.status(200).send({
      success: "true",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const getStatementList = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let db = getDatabase();
    db.statements.loadDatabase();
    db.statements.find({ user: user }, function (err, docs) {
      docs.forEach((doc) => delete doc.user);
      return res.status(200).send({
        success: "true",
        statements: docs,
      });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const getSubordinateStatements = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let subordinates = (await getSubordinates(user)) as Array<string>;

    let db = getDatabase();
    db.statements.loadDatabase();

    let statements = [];
    for (const subordinate of subordinates) {
      let statementsPromise = new Promise(function (resolve, reject) {
        let temp = [];
        db.statements.find({ user: subordinate }, function (err, docs) {
          docs.forEach(function (doc) {
            if (doc.status !== StatementStatus.agreed) {
              temp.push(doc);
            }
            //console.log(temp)
          });
          resolve(temp);
        });
      });
      let userStatements = await statementsPromise;
      statements = statements.concat(userStatements);
    }
    return res.status(200).send({
      success: "true",
      statements: statements,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const revokeStatement = async (req, res) => {
  try {
    let statementID = req.body.statementID;
    if (!statementID) {
      return res.status(500).json({
        success: false,
        errors: { messages: "statement id is empty" },
      });
    }

    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let db = getDatabase();
    db.statements.loadDatabase();
    db.statements.update(
      { user: user, _id: statementID },
      { $set: { status: StatementStatus.revoked } },
      {},
      function (err) {
        if (err == null) {
          console.log(
            `Change status ${statementID} statement on ${StatementStatus.revoked}`
          );
          return res.status(200).send({
            success: "true",
          });
        } else {
          return res.status(500).json({
            success: false,
            errors: { messages: "invalid statement id" },
          });
        }
      }
    );
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const cancelStatement = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let statementID = req.body.statementID;
    let comments = req.body.comments ? req.body.comments : "";
    if (!statementID) {
      return res.status(500).json({
        success: false,
        errors: { messages: "statement id is empty" },
      });
    }
    await setStatementStatusByManager(
      user,
      statementID,
      res,
      StatementStatus.canceled,
      comments
    );
    //console.log(userOwnerStatementID)
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const agreeStatement = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let statementID = req.body.statementID;
    if (!statementID) {
      return res.status(500).json({
        success: false,
        errors: { messages: "statement id is empty" },
      });
    }
    await setStatementStatusByManager(
      user,
      statementID,
      res,
      StatementStatus.agreed
    );
    //console.log(userOwnerStatementID)
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const getUsers = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let userID = await getUserID(user);
    let db = getDatabase();
    db.users.loadDatabase();
    let promise = new Promise(function (resolve, reject) {
      db.users.findOne({ _id: userID }, function (err, doc) {
        if (err == null) {
          resolve(doc.role == Role.admin);
        } else resolve(false);
      });
    });
    if (!(await promise)) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "u dont have right" } });
    }

    promise = new Promise((resolve) => {
      let result = [];
      db.users.find({}, async function (err, docs) {
        for (const doc of docs) {
          let prom = new Promise((res) => {
            db.users.findOne(
              { _id: doc.directorID },
              function (err, directorDoc) {
                let director = "";
                if (err == null && directorDoc) {
                  director = directorDoc.fullName;
                } else {
                  director = null;
                }
                res(director);
              }
            );
          });
          result.push({
            _id: doc._id,
            fullName: doc.fullName,
            position: doc.position,
            role: doc.role,
            director: await prom,
          });
        }
        resolve(result);
      });
    });
    return res.status(200).send({
      success: "true",
      users: await promise,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const positions = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let db = getDatabase();
    db.positions.loadDatabase();
    db.positions.find({}, function (err, docs) {
      if (err == null) {
        return res.status(200).send({
          success: "true",
          positions: docs,
        });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const addPosition = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let adminID = await getUserID(user);
    let db = getDatabase();
    db.users.loadDatabase();

    let promise = new Promise(function (resolve, reject) {
      db.users.findOne({ _id: adminID }, function (err, doc) {
        if (err == null) {
          resolve(doc.role == Role.admin);
        } else resolve(false);
      });
    });
    if (!(await promise)) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "u dont have right" } });
    }

    let position = req.body.position;
    if (!position) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    db.positions.loadDatabase();
    db.positions.findOne({ position: position }, function (err, doc) {
      if (doc == null) {
        db.positions.insert({ position: position });
        return res.status(200).send({
          success: "true",
        });
      } else {
        return res.status(500).json({
          success: false,
          errors: { messages: "Position already exists" },
        });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const getDocuments = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let userID = await getUserID(user);
    let db = getDatabase();
    db.users.loadDatabase();

    let promise = new Promise(function (resolve, reject) {
      db.users.findOne({ _id: userID }, function (err, doc) {
        if (err == null) {
          resolve(doc.role == Role.admin);
        } else resolve(false);
      });
    });
    if (!(await promise)) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "u dont have right" } });
    }

    db.statements.loadDatabase();
    db.statements.find({}, async function (err, docs) {
      let result = [];
      for (const doc of docs) {
        let name = await getUserName(doc.user);
        result.push({
          ...doc,
          name,
        });
      }
      return res.status(200).send({
        success: "true",
        statements: result,
      });
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const changeUserData = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let adminID = await getUserID(user);
    let db = getDatabase();
    db.users.loadDatabase();

    let promise = new Promise(function (resolve, reject) {
      db.users.findOne({ _id: adminID }, function (err, doc) {
        if (err == null) {
          resolve(doc.role == Role.admin);
        } else resolve(false);
      });
    });
    if (!(await promise)) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "u dont have right" } });
    }

    let userID = req.body.userID;
    let fullName = req.body.fullname;
    let position = req.body.position;
    let roles = req.body.roles;
    let directorID = req.body.directorID ? req.body.directorID : null;

    user = {
      id: uuid.v4(),
      fullName: fullName,
      position: position,
      role: roles,
      directorID: directorID,
    };
    db.users.update({ _id: userID }, { $set: user }, {}, function (err) {
      if (err == null) {
        console.log(`Change data ${userID}`);
        return res.status(200).send({
          success: "true",
        });
      } else {
        return res
          .status(500)
          .json({ success: false, errors: { messages: "invalid user id" } });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};
//
// export const changeStatementData = async (req, res) => {
//     try {
//         let token = req.headers.authorization.split("Bearer ")[1];
//         let user = parseUserFromJWT(token);
//         if (!user){
//             return res
//                 .status(500)
//                 .json({ success: false, errors: { messages: 'Error on server' } });
//         }
//         let adminID = await getUserID(user);
//         let db = getDatabase();
//         db.users.loadDatabase();
//
//         let promise = new Promise(function (resolve, reject) {
//             db.users.findOne({_id: adminID}, function (err, doc){
//                 if (err == null) {
//                     resolve(doc.role == Role.admin);
//                 } else resolve(false);
//             })
//         })
//         if (!await promise){
//             return res
//                 .status(500)
//                 .json({ success: false, errors: { messages: 'u dont have right' } });
//         }
//
//         let type = req.body.type || req.body.type == 0 ? parseInt(req.body.type): null;
//         let startDate = req.body.startDate? moment(req.body.startDate, 'DD.MM.YYYY'): null;
//         let countDay = req.body.countDay? parseInt(req.body.countDay): null;
//         if (!startDate || !countDay){
//             return res
//                 .status(500)
//                 .json({ success: false, errors: { messages: 'enter required argument' } });
//         }
//         let [dateFollowedWork, vacationSpot] = [null, null]
//         if (type == 2 || type == 3){
//             dateFollowedWork = req.body.dateFollowedWork? req.body.dateFollowedWork: null;
//             if (!dateFollowedWork){
//                 return res
//                     .status(500)
//                     .json({ success: false, errors: { messages: 'enter date followed work' } });
//             }
//         }
//         vacationSpot = req.body.vacationSpot? vacationSpot: null;
//
//     } catch (err) {
//         return res
//             .status(500)
//             .json({ success: false, errors: { messages: 'Error on server' } });
//     }
// }
//

export const addUserRole = async (req, res) => {
  try {
    let db = getDatabase();

    let role = req.body.role;
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const managers = async (req, res) => {
  try {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = parseUserFromJWT(token);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "Error on server" } });
    }
    let db = getDatabase();
    db.users.loadDatabase();
    db.users.find({ role: Role.manager }, function (err, docs) {
      if (err == null) {
        return res.status(200).send({
          success: "true",
          users: docs,
        });
      }
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};

export const template = async (req, res) => {
  try {
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, errors: { messages: "Error on server" } });
  }
};
