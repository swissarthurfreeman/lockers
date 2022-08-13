import Router from "express";
import { Locker } from "../../domain/model/Locker";
import { Location } from "../../domain/model/Location";
import { Contract } from "../../domain/model/Contract";
import { ContractService } from "../../domain/service/ContractService";
import { logger } from "../../index";

const ContractRouter = Router();

/**
 * Gets list of all contracts with filtering based on location. 
 * TODO : move to ContractService
 */
ContractRouter.get('/', async (req, res) => {
    if(req.headers.group === 'admin') {
        let statuses: string = null;
        if("statuses" in req.query) {
            statuses = req.query.statuses.toString();
            delete req.query.statuses;
        }
        Contract.findAll({
                include: [{
                    model: Locker,
                    required: true, // FUCKING MANDATORY, OR ELSE IT DOES INNER JOIN AARRGGGH
                    include: [
                        {
                            model: Location,
                            where: req.query
                        }
                    ]
                }]
            })
            .then((contracts: Contract[]) => {
                if(statuses != null) {
                    logger.info("Statuses were provided");
                    const statusList: string[] = statuses.split('.');
                    logger.info(statusList);
                    const trats: Contract[] = contracts.filter((contract: Contract) => {
                        logger.info(contract.status, statusList);
                        logger.info(contract.status in statusList)
                        return statusList.indexOf(contract.status) != -1;
                    })
                    res.status(200).send(trats);
                } else {
                    console.log(contracts[0]);
                    res.status(200).send(contracts);
                }
            })
            .catch((err) => {
                res.status(400).send({message: err.message});
            })
    } else {    // if it's not an admin, send him just his contract (if he has one)
        Contract.findAll({
            where: {email: req.headers.email}, 
            include: [{
                model: Locker,
                include: [{
                    model: Location,
                    where: req.query
                }]
            }]
        })
            .then((contracts: Contract[]) => {
                res.status(200).send(contracts);
            })
            .catch((err) => {
                res.status(400).send({message: err.message});
            });
    }
});

ContractRouter.get('/:id', async (req, res) => {
    if(req.headers.group === 'admin') {
        const contract = await Contract.findByPk(req.params.id, { include: [{ model: Locker, include: [{ model: Location }]}] });
        if(contract == null)
            res.status(404);
        res.send(contract); 
    } else {
        const contract = await Contract.findByPk(req.params.id, { include: [{ model: Locker, include: [{ model: Location }]}] });
        if(contract == null) {
            res.status(404).send();
        } else {
            if(contract.email != req.headers.email) {
                res.send([]);
            } else {
                res.send(contract);
            }
        }
    }   
});

// TODO : move this to service
ContractRouter.post('/', (req, res) => {
    if(req.headers.group != "admin") {  // case where user creates a contract for himself
        Contract.findOne({where: {email: req.headers.email }})
            .then((contract: Contract) => {
                if(contract == null) {
                    ContractService.create(Contract.build({
                        lockerId: req.body.lockerId,
                        firstname: req.headers.firstname,
                        lastname: req.headers.lastname,
                        email: req.headers.email,   // if expiration was provided, take it, or else compute it
                        expiration: ContractService.getExpirationDate()
                    })
                    ).then((contract: Contract) => {
                        res.status(201).send(contract);
                    }).catch((err) => {        
                        res.status(400).send({message: err.message});
                    })
                } else {
                    res.status(403).send({message: "Only admins may create multiple contracts with a same user"});
                }
            });
    } else {
        // case where an admin creates a contract for someone else, user info is in body
        ContractService.create(
            Contract.build({
                lockerId: req.body.lockerId,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                expiration: req.body.expiration != undefined ? req.body.expiration : ContractService.getExpirationDate()
            })
        ).then((contract: Contract) => {
            res.status(201).send(contract);
        }).catch((err) => {        
            res.status(400).send({message: err.message});
        });
    }
});

ContractRouter.put('/:id', (req, res) => {
    if(req.headers.group != "admin" || Object.keys(req.body).length === 0) {
        ContractService.renew(req.params.id)
            .then((renewedContract) => {
                Contract.findByPk(renewedContract.lockerId, {include: [
                    {
                        model: Locker,
                        include: [{
                            model: Location,
                            where: req.query
                        }]
                    }]})
                .then((contr) => { res.status(200).send(contr); });
            })
            .catch((err) => {
                res.status(400).send({message: err.message});
            });
    } else {
        ContractService.update(req.params.id, req.body)
            .then((updatedContract) => {
                res.status(200).send(updatedContract);
            })
            .catch((err) => {
                res.status(400).send({message: err.message});
            });
    }
});

ContractRouter.delete('/:id', (req, res) => {
    ContractService.delete(req.params.id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

export { ContractRouter };