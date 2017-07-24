import * as express from "express";
import {getRequestData, RESTReturn, IRequestData, JSONEndware, ResourceMiddleware} from "crowdsourcing-api";
import {Router as smartystreetRouter} from "./smartystreet";
import {Router as dbAccessRouter} from "./db-access";
import {Router as cgiRouter} from "./cgi";

export function init(router: express.Router) {
    router.get("/hi", (req: express.Request, res: express.Response) => {
        res.jsonp({msg: "Hi from samples!!!"});
    });

    router.get("/long-ret", (req: express.Request, res: express.Response) => {
        setTimeout(() => {res.jsonp({msg: "Hi from long return!"});}, 60000);
    });

    router.get("/message", (req: express.Request, res: express.Response) => {
        res.jsonp({msg: "Howday from the sample"});
    });

    let middleware = ResourceMiddleware<any>((rqd: IRequestData) => Promise.resolve<string>(" :-) :-) :-)"), "happy_faces");

    router.get("/howdy", middleware, JSONEndware((rqd: IRequestData) => {
        return rqd.SelfApiRoute.$J("GET", "/services/cwds-samples/message", {})
        .then((ret: RESTReturn) => {
            return {msg: ret.data.msg + rqd.get<string>("happy_faces")};
        });
    }));

    let addOneToN = (N: number) : number => {   // = 1 + 2 + 3 + ... + N
        let sum = 0;
        for (let i = 1; i <= N; i++)
            sum += i;
        return sum;
    }

    router.get("/add-one-to-n", JSONEndware((rqd: IRequestData) => Promise.resolve({result: addOneToN(rqd.Query["n"])})));

    let NFactorial = (N: number) : number => { // = 1 * 2 * 3 * ... * N
        let product = 1;
        for (let i = 1; i <= N; i++)
            product *= i;
        return product;
    }

    router.get("/n-factorial", JSONEndware((rqd: IRequestData) => Promise.resolve({result: NFactorial(rqd.Query["n"])})));

    // create sub api branch called /cgi to demostrate CGI
    router.use("/cgi", cgiRouter);

    // create sub api branch called /db-access to demostrate database access
    router.use("/db-access", dbAccessRouter);

    // create sub api branch called /smartystreet to demostrate external REST api call
    router.use("/smartystreet", smartystreetRouter);
}