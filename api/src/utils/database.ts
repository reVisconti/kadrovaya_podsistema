let Datastore = require("nedb");

export enum Role {
  user,
  HR,
  manager,
  admin,
}

export enum StatementType {
  annualPaidVacation,
  leaveWithoutPay,
  leaveByPreviousWork,
  leaveFollowedByWork,
}

export enum StatementStatus {
  awaitingApproval,
  revoked,
  canceled,
  agreed,
}
export interface IUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  position: string;
  role: Array<Role>;
  directorID?: string;
}

let db = {
  users: undefined,
  statements: undefined,
  positions: undefined,
};

export function getDatabase() {
  db.users = new Datastore({
    filename: "../database/users",
  });
  db.statements = new Datastore({
    filename: "../database/statements",
  });

  db.positions = new Datastore({
    filename: "../database/positions",
  });
  return db;
}

export function getUserID(email) {
  return new Promise(function (resolve, reject) {
    let db = getDatabase();
    db.users.loadDatabase();
    db.users.findOne({ email: email }, function (err, doc) {
      if (err == null) {
        resolve(doc._id);
      } else resolve(null);
    });
  });
}

export function getUserName(email) {
  return new Promise(function (resolve, reject) {
    let db = getDatabase();
    db.users.loadDatabase();
    db.users.findOne({ email: email }, function (err, doc) {
      if (err == null) {
        resolve(doc.fullName);
      } else resolve(null);
    });
  });
}

export async function setStatementStatusByManager(
  user,
  statementID,
  res,
  status,
  comments?
) {
  let userID = await getUserID(user);
  let userOwnerStatementID = await getUserID(
    (
      await getStatement(statementID)
    )["user"]
  );

  let db = getDatabase();
  db.users.loadDatabase();
  db.users.findOne({ _id: userOwnerStatementID }, function (err, doc) {
    //console.log(doc.directorID, userID)
    if (doc.directorID == userID) {
      db.statements.loadDatabase();
      db.statements.update(
        { _id: statementID },
        { $set: { status: status, comments: comments } },
        {},
        function (err) {
          if (err == null) {
            console.log(
              `Change status ${statementID} statement on ${status} by ${user}`
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
    } else {
      return res
        .status(500)
        .json({ success: false, errors: { messages: "u dont have a right" } });
    }
  });
}

export function getStatement(ID: string) {
  return new Promise(function (resolve, reject) {
    let db = getDatabase();
    db.statements.loadDatabase();
    db.statements.findOne({ _id: ID }, function (err, doc) {
      if (err == null) {
        resolve(doc);
      } else resolve(null);
    });
  });
}

export async function getSubordinates(email) {
  let userID = await getUserID(email);
  if (!userID) return [];

  return new Promise(function (resolve, reject) {
    let subordinates = [];

    let db = getDatabase();
    db.users.loadDatabase();
    db.users.find({ directorID: userID }, function (err, docs) {
      docs.forEach(function (doc) {
        subordinates.push(doc.email);
      });
      resolve(subordinates);
    });
  });
}
