import * as express from "express";
import {getRequestData, RESTReturn, IRequestData, Endware, ResourceMiddleware} from "crowdsourcing-api";
import {Router as smartystreetRouter} from "./smartystreet";
import {Router as dbAccessRouter} from "./db-access";

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

    router.get("/howdy", middleware, Endware((rqd: IRequestData) => {
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

    router.get("/add-one-to-n", Endware((rqd: IRequestData) => Promise.resolve({result: addOneToN(rqd.Query["n"])})));

    let NFactorial = (N: number) : number => { // = 1 * 2 * 3 * ... * N
        let product = 1;
        for (let i = 1; i <= N; i++)
            product *= i;
        return product;
    }

    router.get("/n-factorial", Endware((rqd: IRequestData) => Promise.resolve({result: NFactorial(rqd.Query["n"])})));

    router.use("/db-access", dbAccessRouter);

    // create sub api branch called /smartystreet
    router.use("/smartystreet", smartystreetRouter);
}