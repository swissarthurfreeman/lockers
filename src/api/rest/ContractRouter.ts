import Router from "express";
import { Locker } from "../../domain/model/Locker";
import { Contract } from "../../domain/model/Contract";
import { User } from "../../domain/model/User";

const ContractRouter = Router();

ContractRouter.get('/', async (req, res) => {
    const lockers = await Contract.findAll();
    res.send(lockers);
});

ContractRouter.post('/', async (req, res) => {
    console.log(req.body);  // TODO : check location exists, check user exists, check locker exists
    const newLocker = await Contract.create(req.body);    // TODO : wrap in transaction
    res.send(newLocker);
});

ContractRouter.get('/:id', async (req, res) => {
    const locker = await Contract.findByPk(req.body.lockerId);    // TODO : add error management.
    res.send(locker);
});

ContractRouter.put('/:id', async (req, res) => {
    const lockerToUpdate = await Contract.findByPk(req.params.id);    // TODO : add error management
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