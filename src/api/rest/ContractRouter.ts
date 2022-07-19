import Router from "express";
import { Locker } from "../../domain/model/Locker";
import { Location } from "../../domain/model/Location";
import { Contract } from "../../domain/model/Contract";
import { ContractService } from "../../domain/service/ContractService";

const ContractRouter = Router();

ContractRouter.get('/', async (req, res) => {
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
            res.status(200).send(contracts);
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        })
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