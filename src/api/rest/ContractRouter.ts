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
    console.log(contract)
    console.log(contract.status)
    if(contract == null)
        res.status(404);
    res.send(contract);
});

ContractRouter.post('/', async (req, res) => {
    const locker = await Locker.findByPk(req.body.lockerId);    
    if(locker == null) {
        res.status(400).send("Locker does not exist");
    } else {
        // case where user creates a contract for himself
        ContractService.create(
            Contract.build({
                lockerId: locker.lockerId,
                firstname: req.body.user.firstname,
                lastname: req.body.user.lastname,
                email: req.body.user.email,
                expiration: ContractService.getExpirationDate()
            })
        ).then((contract: Contract) => {
            res.status(201).send(contract);
        }).catch((err) => {
            res.status(400).send(err.message);
        });
    }
});

ContractRouter.put('/:id', async (req, res) => {
    const lockerToUpdate = await Contract.findByPk(req.params.id);    // TODO : add error management, wrap in transaction
    lockerToUpdate.set(req.body);
    const updatedLocker = await lockerToUpdate.save();      // TODO : add error management
    res.send(updatedLocker);
});

ContractRouter.delete('/:id', async (req, res) => {
    const lockerToDestroy = await Contract.findByPk(req.params.id);
    await lockerToDestroy.destroy();
    res.status(204).send();
});

export { ContractRouter };