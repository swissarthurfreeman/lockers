import { logger } from "../index";
import { config } from "../../Config";

const ConfigureHeadersMiddleware = (req: any, res: any, next: any) => {
    req.headers.group = req.headers.oidc_claim_ismemberof,  // undefined if user or part of no groups
    req.headers.firstname = req.headers.oidc_claim_given_name || "John",
    req.headers.lastname = req.headers.oidc_claim_family_name || "Doe",
    req.headers.email = req.headers.oidc_claim_email || "john@doe.ts"
    
    if(config.id == 'dev') {
        req.headers.group = 'admin';
    }

    logger.info(req.method + " " + req.originalUrl, {
        headers: {
            group : req.headers.group, 
            firstname: req.headers.firstname, 
            lastname: req.headers.lastname, 
            email: req.headers.email
        }, 
        body: req.body
    });
    
    next();
}

export { ConfigureHeadersMiddleware };