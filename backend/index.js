const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const mysql = require("mysql");

let add = express();
add.use(cors());
add.use(bodyparser.json());
add.use(express.json());
add.use(bodyparser.urlencoded({ require: true }));
add.use(express.static("public"));

let con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Hari@iphon6",
  database: "guestroom",
});

con.connect(function (error) {
  if (error) {
    console.log(error);
  } else {
    console.log("Connection Successfull");
  }
});

add.post("/signup", (req, res) => {
  try {
    try {
      // first we need to need check if the person is already existed in database or not
      let userCount = "select count(*) as count from admin where username = ?";
      con.query(userCount, [req.body.email], (error, result) => {
        if (error) {
          res.send(error);
        } else {
          if (result && result[0] && result[0].count > 0) {
            let msg = {
              message: "User is already existed!",
            };
            res.send(msg);
          } else {
            let insertData =
              "insert into admin(name,username,pword,created_date) values(?,?,?,current_timestamp())";
            con.query(
              insertData,
              [req.body.name, req.body.email, req.body.password],
              (err, resul) => {
                if (err) {
                  let msg = {
                    message: err,
                    code: 500,
                  };
                  res.send(msg);
                } else {
                  let msg = {
                    message: "User had been registered Successfully!",
                    code: 200,
                  };
                  res.send(msg);
                }
              }
            );
          }
        }
      });
    } catch (appError) {
      console.log(appError);
    }
  } catch (systemError) {
    console.log(systemError);
  }
});

add.post("/login", (req, res) => {
  try {
    try {
      let userCount =
        "select count(*) as count from admin where username = ? and pword = ? ";
      con.query(
        userCount,
        [req.body.email, req.body.password],
        (error, result) => {
          if (error) {
            res.send(error);
          } else {
            if (result && result[0] && result[0].count > 0) {
              let userInfo =
                "select admin_id,name,username from admin where username = ? and pword = ?";
              con.query(
                userInfo,
                [req.body.email, req.body.password],
                (loginErr, loginRes) => {
                  if (loginErr) {
                    res.send(loginErr);
                  } else {
                    let msg = {
                      code: 200,
                      message: "Successfully logined",
                      adminId: loginRes[0].admin_id,
                      name: loginRes[0].name,
                      username: loginRes[0].email,
                    };
                    res.send(msg);
                  }
                }
              );
            } else {
              let msg = {
                code: 500,
                message: "Invalid User!",
              };
              res.send(msg);
            }
          }
        }
      );
    } catch (appError) {
      console.log(appError);
    }
  } catch (systemError) {
    console.log(systemError);
  }
});

add.get("/rooms", (req, res) => {
  try {
    let bookCountQuery = "select * from rooms";
    con.query(bookCountQuery, (getError, getResult) => {
      if (getError) {
        res.send(getError);
      } else {
        return res.json(getResult);
      }
    });
  } catch (systemError) {
    console.log(systemError);
  }
});

add.listen(3015, () => {
  console.log("Running on port 3015");
});
