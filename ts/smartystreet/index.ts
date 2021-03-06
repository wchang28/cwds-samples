import * as express from "express";
import * as core from 'express-serve-static-core';
import {getRequestData, RESTReturn, IAuthorizedApiRoute, JSONEndware, IRequestData} from "crowdsourcing-api";

let router = express.Router()
export {router as Router};

let auth_id = "{auth_id}";
let auth_token = "{auth_token}";

interface SmartyStreetAddressQueryRow {
    street: string;
    city: string;
    state: string;
    zipcode: string;
    input_id?: string;
    candidates?: number;
}

router.get("/query", JSONEndware((rqd: IRequestData) => {
    let samrtyStreetApi: IAuthorizedApiRoute = rqd.getRestApiRoute({instance_url: "https://api.smartystreets.com"});
    let smartyQuery: SmartyStreetAddressQueryRow[] = [
        {
            street: "45 E 45th St"
            ,city: "New York"
            ,state: "NY"
            ,zipcode: "10017"
            ,input_id: "59754256"
        }
    ];
    return samrtyStreetApi.$J("POST", '/street-address?auth-id=' + auth_id + '&auth-token=' + auth_token, smartyQuery).then((ret: RESTReturn) => ret.data);
}));