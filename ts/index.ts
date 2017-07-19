import * as express from "express";
import {getRequestData, RESTReturn} from "crowdsourcing-api";
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

    let middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        let rqd = getRequestData(req);
        rqd.set("happy_faces", " :-) :-) :-)");
        next();
    }

    router.get("/howdy", middleware, (req: express.Request, res: express.Response) => {
        let rqd = getRequestData(req);
        rqd.SelfApiRoute.$J("GET", "/services/cwds-samples/message", {})
        .then((ret: RESTReturn) => {
            res.jsonp(ret.data.msg + rqd.get("happy_faces"));
        }).catch((err: any) => {
            res.status(400).json(err);
        });
    });

    let addOneToN = (N: number) : number => {   // = 1 + 2 + 3 + ... + N
        let sum = 0;
        for (let i = 1; i <= N; i++)
            sum += i;
        return sum;
    }

    router.get("/add-one-to-n", (req: express.Request, res: express.Response) => {
        //console.log("1+2+3...+N");
        let rqd = getRequestData(req);
        res.jsonp({result: addOneToN(rqd.Query["n"])});
    });

    let NFactorial = (N: number) : number => { // = 1 * 2 * 3 * ... * N
        let product = 1;
        for (let i = 1; i <= N; i++)
            product *= i;
        return product;
    }

    router.get("/n-factorial", (req: express.Request, res: express.Response) => {
        let rqd = getRequestData(req);
        res.jsonp({result: NFactorial(rqd.Query["n"])});
    });
    
    router.use("/db-access", dbAccessRouter);

    // create sub api branch called /smartystreet
    router.use("/smartystreet", smartystreetRouter);
}