import Router from "express";
import { Locker } from "../../domain/model/Locker";
import { LockerService } from "../../domain/service/LockerService";
import { Location } from "../../domain/model/Location";
import { Contract } from "../../domain/model/Contract";
import { Op } from "sequelize";

const LockerRouter = Router();

/**
 * Gets list of all free lockers with filtering via location. 
 */
LockerRouter.get('/', async (req, res) => {
    // if a location is specified, it must exist, else returns all locations
    Location.findOne({where: req.query})
        .then(async (location: Location) => {
            if(location == null) {
                if(JSON.stringify(req.query) == "{}") {
                    res.status(404).send({message: "There are no locations or lockers in the database"});    
                } else {
                    res.status(404).send({message: "Specified Location does not exist"});
                }
            } else {
                const contracts: Contract[] = await Contract.findAll();
                const lockersWithContractsIds: string[] = contracts.map(contr => contr.lockerId);
                
                const lockers: Locker[] = await Locker.findAll({
                    where: {
                        lockerId: { [Op.notIn]: lockersWithContractsIds}
                    },
                    include: [{
                        model: Location,
                        where: req.query,
                    }] 
                });
                res.send(lockers);
            }
        })
        .catch((err) => {
            res.status(400).send({ message: err.message });
        });
});

LockerRouter.get('/:id', (req, res) => {
    Locker.findByPk(req.params.id, { include: Location })
        .then((locker: Locker) => {
            if(locker == null) { 
                res.status(404).send();
            } else {
                res.status(200).send(locker);
            }
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

LockerRouter.post('/', (req, res) => {
    LockerService.create(Locker.build(req.body))
        .then((locker: Locker) => {
            res.status(201).send(locker);
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

LockerRouter.put('/:id', (req, res) => {
    LockerService.update(req.params.id, req.body)
        .then((locker: Locker) => {
            res.status(200).send(locker);
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

LockerRouter.delete('/:id', (req, res) => {
    LockerService.destroy(req.params.id)
        .then(() => {
            res.status(200).send({message: "Locker successfully removed"});
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

export { LockerRouter };