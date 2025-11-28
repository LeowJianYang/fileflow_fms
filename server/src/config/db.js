import db from 'mysql2';
import dbPromise from 'mysql2/promise.js';

const url = new URL(process.env.SERVICE_URI);

const connection=  db.createPool({
    host: process.env.DB_INFF_HN,
    user: process.env.DB_INFF_UN,
    password: process.env.DB_INFF_PW,
    database: url.pathname.replace("/",""),
    port:process.env.DB_INFF_PR,
    waitForConnections:true,
})

const promiseConnection = dbPromise.createPool({
    host: process.env.DB_INFF_HN,
    user: process.env.DB_INFF_UN,
    password: process.env.DB_INFF_PW,
    database: url.pathname.replace("/",""),
    port:process.env.DB_INFF_PR,
    waitForConnections:true,
});

export {connection, promiseConnection};