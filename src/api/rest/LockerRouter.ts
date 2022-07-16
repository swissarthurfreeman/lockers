import Router from "express";
import { Locker } from "../../domain/model/Locker";

const LockerRouter = Router();

LockerRouter.get('/', async (req, res) => {
    const lockers = await Locker.findAll();
    res.send(lockers);
});

LockerRouter.post('/', async (req, res) => {
    console.log(req.body);  // TODO : check location exists
    const newLocker = await Locker.create(req.body);    // TODO : wrap in transaction
    res.send(newLocker);
});

LockerRouter.get('/:id', async (req, res) => {
    const locker = await Locker.findByPk(req.body.lockerId);    // TODO : add error management.
    res.send(locker);
});

LockerRouter.put('/:id', async (req, res) => {
    const lockerToUpdate = await Locker.findByPk(req.params.id);    // TODO : add error management
    lockerToUpdate.set(req.body);
    const updatedLocker = await lockerToUpdate.save();      // TODO : add error management
    res.send(updatedLocker);
});

LockerRouter.delete('/:id', async (req, res) => {
    const lockerToDestroy = await Locker.findByPk(req.params.id);
    await lockerToDestroy.destroy();
    res.status(204).send();
});

export { LockerRouter };