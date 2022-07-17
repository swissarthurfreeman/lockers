import Router from "express";
import { Locker } from "../../domain/model/Locker";
import { LockerService } from "../../domain/service/LockerService";

const LockerRouter = Router();

LockerRouter.get('/', async (req, res) => {
    res.send(await Locker.findAll());
});

LockerRouter.get('/:id', async (req, res) => {
    const locker = await Locker.findByPk(req.params.id);    
    if(locker == null) 
        res.status(404);
    res.send(locker);
});

LockerRouter.post('/', async (req, res) => {
    LockerService.create(Locker.build(req.body))
        .then((locker: Locker) => {
            res.status(201).send(locker);
        })
        .catch((err) => {
            res.status(400).send(err.message);
        });
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