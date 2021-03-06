import * as express from "express";
import * as core from 'express-serve-static-core';
import {CGIEndware, IRequestData} from "crowdsourcing-api";
import * as path from 'path';

let router = express.Router()
export {router as Router};

router.get("/curl-example", CGIEndware("text/html", (rqd: IRequestData) => rqd.CGIChildProcessLauncher.exec("curl https://www.google.com")));
router.get("/node-example", CGIEndware("application/json", (rqd: IRequestData) => rqd.CGIChildProcessLauncher.exec("node " + path.join(__dirname, "./node/test.js"))));
router.get("/python-example", CGIEndware("application/json", (rqd: IRequestData) => rqd.CGIChildProcessLauncher.exec("python " + path.join(rqd.ThisModule.homePath,  "./python/test.py"))));