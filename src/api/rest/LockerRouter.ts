import Router from "express";
import { Locker } from "../../domain/model/Locker";
import { LockerService } from "../../domain/service/LockerService";
import { Location } from "../../domain/model/Location";

const LockerRouter = Router();

LockerRouter.get('/', async (req, res) => {
    // if a location is specified, it must exist, else returns all locations
    const location = await Location.findOne({where: req.query});    
    if(location == null) {
        res.status(404).send({message: "Specified Location does not exist"});
    } else {
        const lockers: Locker[] = await Locker.findAll({ 
            include: [{
                model: Location,
                where: req.query,
            }] 
        });
        res.send(lockers);
    }
});

LockerRouter.get('/:id', async (req, res) => {
    const locker = await Locker.findByPk(req.params.id, { include: Location });    
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
            res.status(400).send({message: err.message});
        });
});

LockerRouter.put('/:id', async (req, res) => {
    LockerService.update(req.params.id, req.body)
        .then((locker: Locker) => {
            res.status(200).send(locker);
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

LockerRouter.delete('/:id', async (req, res) => {
    LockerService.destroy(req.params.id)
        .then(() => {
            res.status(200).send({message: "Locker successfully removed"});
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

export { LockerRouter };