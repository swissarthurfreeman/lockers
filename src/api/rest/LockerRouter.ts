import Router from "express";
import { Locker } from "../../domain/model/Locker";
import { LockerService } from "../../domain/service/LockerService";

const LockerRouter = Router();

LockerRouter.get('/', async (req, res) => {
    res.send(await LockerService.getAll());
});

LockerRouter.get('/:id', async (req, res) => {
    res.send(await LockerService.getById(req.params.id));
});

LockerRouter.post('/', async (req, res) => {
    console.log(req.body);
    res.send(await LockerService.create(Locker.build(req.body)));
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