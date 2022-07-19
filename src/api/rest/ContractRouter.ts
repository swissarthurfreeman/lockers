import Router from "express";
import { Locker } from "../../domain/model/Locker";
import { Location } from "../../domain/model/Location";
import { Contract } from "../../domain/model/Contract";
import { ContractService } from "../../domain/service/ContractService";

const ContractRouter = Router();

/**
 * Gets list of all contracts with filtering based on location. 
 * TODO : move to ContractService
 */
ContractRouter.get('/', async (req, res) => {
    if(req.body.user.group.indexOf('admin') != -1) {
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
                    console.log("Statuses were provided");
                    const statusList: string[] = statuses.split('.');
                    console.log(statusList);
                    const trats: Contract[] = contracts.filter((contract: Contract) => {
                        console.log(contract.status, statusList);
                        console.log(contract.status in statusList)
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
        Contract.findAll({where: {email: req.body.user.email}})
            .then((contracts: Contract[]) => {
                res.status(200).send(contracts);
            })
            .catch((err) => {
                res.status(400).send({message: err.message});
            });
    }
});

ContractRouter.get('/:id', async (req, res) => {
    const contract = await Contract.findByPk(req.params.id, { include: Locker });
    if(contract == null)
        res.status(404);
    res.send(contract);
});

// todo : check id is uuid.
ContractRouter.post('/', (req, res) => {
    // case where user creates a contract for himself
    ContractService.create(
        Contract.build({
            lockerId: req.body.lockerId,
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            email: req.body.user.email,
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