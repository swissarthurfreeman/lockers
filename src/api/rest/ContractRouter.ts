import Router from "express";
import { Locker } from "../../domain/model/Locker";
import { Contract } from "../../domain/model/Contract";
import { ContractService } from "../../domain/service/ContractService";

const ContractRouter = Router();

ContractRouter.get('/', async (req, res) => {
    const contracts = await Contract.findAll();
    res.send(contracts);
});

ContractRouter.get('/:id', async (req, res) => {
    const contract = await Contract.findByPk(req.params.id, { include: Locker });
    if(contract == null)
        res.status(404);
    res.send(contract);
});

// todo : check id is uuid.
ContractRouter.post('/', async (req, res) => {
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

ContractRouter.put('/:id', async (req, res) => {
    ContractService.update(req.params.id, req.body)
        .then((updatedContract) => {
            res.status(200).send(updatedContract);
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

ContractRouter.delete('/:id', async (req, res) => {
    ContractService.delete(req.params.id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

export { ContractRouter };