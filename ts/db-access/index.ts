import * as express from "express";
import * as core from 'express-serve-static-core';
import {getRequestData} from "crowdsourcing-api";
import * as expressMSSQL from "express-mssql";

let router = express.Router()
export {router as Router};

let options: expressMSSQL.Options = {
    configSrc: (req: express.Request) => ({server: "AWS-PRD-SQL01", database: "SFDC", options: {trustedConnection: true}})
    ,msnodesqlv8: true
    ,connectedPoolCallback: (req: express.Request, conn: expressMSSQL.ConnectionPool) => {
        getRequestData(req).set("db_connection", conn);
    }
    ,poolErrorCallback: (err: any) => {console.error("!!! pool error: " + JSON.stringify(err));}
};

router.use("/", expressMSSQL.get(options));

router.get("/query", (req: express.Request, res: express.Response) => {
    let rqd = getRequestData(req);
    let conn: expressMSSQL.ConnectionPool = rqd.get("db_connection");
    conn.request().query("SELECT * FROM [dbo].[Account_Codes]")
    .then((result: expressMSSQL.IResult<any>) => {
        res.status(500).json(result);
    }).catch((err: any) => {
        res.status(500).json(err);
    })
})