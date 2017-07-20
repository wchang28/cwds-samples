import * as express from "express";
import * as core from 'express-serve-static-core';
import {getRequestData, Endware, IRequestData} from "crowdsourcing-api";
import * as expressMSSQL from "express-mssql";

let router = express.Router()
export {router as Router};

let db_options_1: expressMSSQL.Options = {
    configSrc: (req: express.Request) => ({server: "AWS-PRD-SQL01", database: "TestDB", options: {trustedConnection: true}})
    ,msnodesqlv8: true
    ,connectedPoolCallback: (req: express.Request, conn: expressMSSQL.ConnectionPool) => {getRequestData(req).set("db_connection", conn);}
};

router.use("/db-1", expressMSSQL.get(db_options_1));

router.get("/db-1/query", Endware((rqd: IRequestData) => {
    let conn = rqd.get<expressMSSQL.ConnectionPool>("db_connection");
    return conn.request().query("SELECT * FROM [dbo].[ids]")
    .then((result: expressMSSQL.IResult<any>) => result.recordset);
}));

let db_options_2: expressMSSQL.Options = {
    configSrc: (req: express.Request) => ({server: "AWS-PRD-SQL01", database: "QMarket", options: {trustedConnection: true}})
    ,msnodesqlv8: true
    ,connectedPoolCallback: (req: express.Request, conn: expressMSSQL.ConnectionPool) => {getRequestData(req).set("db_connection", conn);}
};

router.use("/db-2", expressMSSQL.get(db_options_2));

router.get("/db-2/query", Endware((rqd: IRequestData) => {
    let conn = rqd.get<expressMSSQL.ConnectionPool>("db_connection");
    return conn.request().query("SELECT * FROM [dbo].[BusinessDays]")
    .then((result: expressMSSQL.IResult<any>) => result.recordset);
}));