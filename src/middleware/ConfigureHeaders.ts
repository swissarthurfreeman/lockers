import { logger } from "../index";
import { config } from "../../Config";

const ConfigureHeadersMiddleware = (req: any, res: any, next: any) => {
    logger.info(req.method + " " + req.originalUrl, {headers: req.headers, body: req.body});    
    req.body.user = {
        group: ["user"],
        firstname: req.headers.oidc_claim_given_name || "John",
        lastname: req.headers.oidc_claim_family_name || "Doe",
        email: req.headers.oidc_claim_email || "john@doe.ts"
    }
    req.body.user.group.push(req.headers.oidc_claim_ismemberof);
    if(config.id == 'test' /*|| config.id == 'dev'*/) {
        req.body.user.group.push('admin');
    }
    console.log(req.body)
    next();
}

export { ConfigureHeadersMiddleware };