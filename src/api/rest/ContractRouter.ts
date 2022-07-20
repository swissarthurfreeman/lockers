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
                include: [
                    {
                        model: Locker,
                        include: [{
                            model: Location,
                            where: req.query
                        }]
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
        const contract = await Contract.findByPk(req.params.id, { include: Locker });
        if(contract == null)
            res.status(404);
        res.send(contract); 
    } else {
        const contract = await Contract.findByPk(req.params.id, { include: Locker });
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

// todo : check id is uuid, make it so that a user can only post one contract
// todo : make sure contract isn't out of service.
ContractRouter.post('/', (req, res) => {
    // case where user creates a contract for himself
    ContractService.create(
        Contract.build({
            lockerId: req.body.lockerId,
            firstname: req.headers.firstname,
            lastname: req.headers.lastname,
            email: req.headers.email,
            expiration: ContractService.getExpirationDate()
        })
    ).then((contract: Contract) => {
        res.status(201).send(contract);
    }).catch((err) => {        
        res.status(400).send({message: err.message});
    });
});

ContractRouter.put('/:id', (req, res) => {
    ContractService.update(req.params.id, req.body)
        .then((updatedContract) => {
            res.status(200).send(updatedContract);
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
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