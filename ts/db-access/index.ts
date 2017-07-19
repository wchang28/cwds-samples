import * as express from "express";
import * as core from 'express-serve-static-core';
import {getRequestData} from "crowdsourcing-api";
import * as expressMSSQL from "express-mssql";

let router = express.Router()
export {router as Router};

let db_options_1: expressMSSQL.Options = {
    configSrc: (req: express.Request) => ({server: "AWS-PRD-SQL01", database: "TestDB", options: {trustedConnection: true}})
    ,msnodesqlv8: true
    ,connectedPoolCallback: (req: express.Request, conn: expressMSSQL.ConnectionPool) => {getRequestData(req).set("db_connection", conn);}
};

router.use("/db-1", expressMSSQL.get(db_options_1));

router.get("/db-1/query", (req: express.Request, res: express.Response) => {
    let rqd = getRequestData(req);
    let conn: expressMSSQL.ConnectionPool = rqd.get("db_connection");
    conn.request().query("SELECT * FROM [dbo].[ids]")
    .then((result: expressMSSQL.IResult<any>) => {
        res.jsonp(result.recordset);
    }).catch((err: any) => {
        res.status(500).json(err);
    });
});

let db_options_2: expressMSSQL.Options = {
    configSrc: (req: express.Request) => ({server: "AWS-PRD-SQL01", database: "QMarket", options: {trustedConnection: true}})
    ,msnodesqlv8: true
    ,connectedPoolCallback: (req: express.Request, conn: expressMSSQL.ConnectionPool) => {getRequestData(req).set("db_connection", conn);}
};

router.use("/db-2", expressMSSQL.get(db_options_2));

router.get("/db-2/query", (req: express.Request, res: express.Response) => {
    let rqd = getRequestData(req);
    let conn: expressMSSQL.ConnectionPool = rqd.get("db_connection");
    conn.request().query("SELECT * FROM [dbo].[BusinessDays]")
    .then((result: expressMSSQL.IResult<any>) => {
        res.jsonp(result.recordset);
    }).catch((err: any) => {
        res.status(500).json(err);
    });
});