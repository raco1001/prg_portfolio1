const mariadb = require("mysql");

const conn = mariadb.createConnection({
  host: "218.234.14.81",
  port: 3307,
  user: "root",
  password: "root",
  database: "Tennis",
});

module.exports = conn;
