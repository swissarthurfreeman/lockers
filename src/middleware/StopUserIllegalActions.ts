import { logger } from "../index";

const StopUserIllegalActions = (req: any, res: any, next: any) => {
    if(req.method != 'GET' && req.headers.group != "admin") { // if a user does something that's not a GET
        if( (req.method === 'PUT' || req.method === 'POST') && req.originalUrl === '/contracts' ) {
            logger.info("User is attempting to update/create a contract", {headers: req.headers, body: req.body});
            if(req.method === 'PUT') {
                if(Object.keys(req.body).length === 1 && Object.keys(req.body)[0] === "expiration") {
                    next();
                } else {
                    res.status(403).send({message: "Users may only update contract expiration in renewal window"});
                }
            } else {
                next(); // it's a POST
            }
        } else {
            logger.info("403 Forbidden user action attempt", {headers: req.headers, body: req.body});
            res.status(403).send({message: "This action may only be done by admins"});
        }
    } else {
        next();
    }
}

export { StopUserIllegalActions };