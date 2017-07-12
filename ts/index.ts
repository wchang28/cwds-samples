import * as express from "express";
import {getRequestData, RESTReturn} from "crowdsourcing-api";
import {Router as smartystreetRouter} from "./smartystreet";

export function init(router: express.Router) {
    router.get("/hi", (req: express.Request, res: express.Response) => {
        //setTimeout(() => {res.jsonp({msg: "Hi from samples great!"});}, 30000);
        res.jsonp({msg: "Hi from samples!"});
    });

    router.get("/long-ret", (req: express.Request, res: express.Response) => {
        setTimeout(() => {res.jsonp({msg: "Hi from long return!"});}, 30000);
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

    router.get("/calc", (req: express.Request, res: express.Response) => {
        res.jsonp({result: addOneToN(10)});
    })

    router.use("/smartystreet", smartystreetRouter);
}