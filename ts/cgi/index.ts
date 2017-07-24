import * as express from "express";
import * as core from 'express-serve-static-core';
import {CGIEndware, IRequestData} from "crowdsourcing-api";

let router = express.Router()
export {router as Router};

router.get("/curl-example", CGIEndware("text/html", (rqd: IRequestData) => rqd.CGIChildProcessLauncher.exec("curl https://www.google.com")));