import * as express from "express";
import * as core from 'express-serve-static-core';
import {getRequestData, RESTReturn, IAuthorizedApiRoute} from "crowdsourcing-api";

let router = express.Router()
export {router as Router};

router.use("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let rqd = getRequestData(req);
    rqd.set("smartystreet_api", rqd.getRestApiRoute({instance_url: "https://api.smartystreets.com"}));
    next();
});

interface SmartyStreetAddressQueryRow {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    input_id?: string;
    candidates?: number;
}

router.get("/query", (req: express.Request, res: express.Response) => {
    let rqd = getRequestData(req);
    let samrtStreetApi:IAuthorizedApiRoute = rqd.get("smartystreet_api");
    let smartyQuery: SmartyStreetAddressQueryRow[] = [
        {
            street: "45 E 45th St"
            ,city: "New York"
            ,state: "NY"
            ,zipcode: "10017"
            ,input_id: "59754256"
        }
    ];
    samrtStreetApi.$J("POST", '/street-address?auth-id={auth-id}&auth-token={auth-token}', smartyQuery)
    .then((ret: RESTReturn) => {
        let addressInfo = ret.data;
        res.jsonp(addressInfo);
    }).catch((err: any) => {
        res.status(400).json(err);
    });
});