const mysql = require('mysql');

const pool  = mysql.createPool({
    connectionLimit: 15,
    host: "aqx5w9yc5brambgl.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "hs5myapojoylquun",
    password: "txdmdvhmkxtssfrf",
    database: "bepuy5ijvb0xwfel"
});

module.exports = pool;

/*
jawsdb
standard
hostname: aqx5w9yc5brambgl.cbetxkdyhwsb.us-east-1.rds.amazonaws.com
port: 3306
username: hs5myapojoylquun
password: txdmdvhmkxtssfrf
default schema/database: bepuy5ijvb0xwfel


mysql://hs5myapojoylquun:txdmdvhmkxtssfrf@aqx5w9yc5brambgl.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/bepuy5ijvb0xwfel
*/