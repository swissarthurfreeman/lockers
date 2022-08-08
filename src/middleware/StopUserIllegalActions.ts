import { logger } from "../index";

const StopUserIllegalActions = (req: any, res: any, next: any) => {
    if(req.method != 'GET' && req.headers.group != "admin") { // if a user does something that's not a GET
        if( req.method === 'PUT' || req.method === 'POST') {
            if((req.originalUrl as string).split('/').indexOf('contracts') === 1) {
                logger.info("User is attempting to update/create a contract", {headers: req.headers, body: req.body});
                next(); // it's a POST, any user can create a single contract, if it's a PUT req.body is ignored 
            } else {
                logger.info("403 Forbidden user action attempt", {headers: req.headers, body: req.body});
                res.status(403).send({message: "This action may only be done by admins"});    
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