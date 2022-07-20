import { logger } from "../index";
import { config } from "../../Config";

const ConfigureHeadersMiddleware = (req: any, res: any, next: any) => {
    logger.info(req.headers);
    if(config.id == 'test') {
        req.body.user = {
            group: req.headers.oidc_group || ["user"],
            firstname: req.headers.oidc_name || "John",
            lastname: req.headers.oidc_family_name || "Doe",
            email: req.headers.oidc_email || "john@doe.ts"
        }
        req.body.user.group.push('admin');
    } else if(config.id == 'production') {
        if(req.headers.oidc_claim_ismemberof == 'admin') {
            req.body.user.group = ['user'];
            req.body.user.group.push('admin');
            req.body.user = {
                group: ["user"],
                firstname: req.headers.oidc_claim_given_name,
                lastname: req.headers.oidc_claim_family_name,
                email: req.headers.oidc_claim_email
            }
        }
    }
    next();
}

export { ConfigureHeadersMiddleware };