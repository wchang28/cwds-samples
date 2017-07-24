import * as express from "express";
import * as core from 'express-serve-static-core';
import {getRequestData, JSONEndware, IRequestData} from "crowdsourcing-api";
import * as expressMSSQL from "express-mssql";

let router = express.Router()
export {router as Router};

let db_options_1: expressMSSQL.Options = {
    configSrc: (req: express.Request) => ({server: "quantsql01", database: "QMarket", options: {trustedConnection: true}})
    ,msnodesqlv8: true
    ,connectedPoolCallback: (req: express.Request, conn: expressMSSQL.ConnectionPool) => {getRequestData(req).set("db_connection", conn);}
};

router.use("/db-1", expressMSSQL.get(db_options_1));

router.get("/db-1/query", JSONEndware((rqd: IRequestData) => {
    let conn = rqd.get<expressMSSQL.ConnectionPool>("db_connection");
    return conn.request().query("SELECT TOP 100 * FROM [dbo].[ZipCode2CBSA]").then((result: expressMSSQL.IResult<any>) => result.recordset);
}));

let db_options_2: expressMSSQL.Options = {
    configSrc: (req: express.Request) => ({server: "trdsql01-dev", database: "QData", options: {trustedConnection: true}})
    ,msnodesqlv8: true
    ,connectedPoolCallback: (req: express.Request, conn: expressMSSQL.ConnectionPool) => {getRequestData(req).set("db_connection", conn);}
};

router.use("/db-2", expressMSSQL.get(db_options_2));

router.get("/db-2/execute", JSONEndware((rqd: IRequestData) => {
    let conn = rqd.get<expressMSSQL.ConnectionPool>("db_connection");
    return conn.request()
    .input("userId", "4037e1a4a149c454d91d8c4d29063061")
    .execute("[dbo].[stp_NodeJSGridGetUserProfile]")
    .then((result: expressMSSQL.IResult<any>) => result.recordset);
}));