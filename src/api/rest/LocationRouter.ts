import Router from "express";
import { LocationService } from "../../domain/service/LocationService";
import { Location } from "../../domain/model/Location";

const LocationRouter = Router();

LocationRouter.get('/', (req, res) => {
    // TODO : validate query ?
    Location.findAll({where: req.query})
        .then((lockers: Location[]) => {
            res.status(200).send(lockers);
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        })
});

LocationRouter.get('/:id', (req, res) => {
    Location.findByPk(req.params.id)
        .then((location: Location) => {
            if(location == null) {
                res.status(404).send({message: "Specified Location does not exist"});
            } else {
                res.status(200).send(location);
            }
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

// TODO : move to service and promisify/transaxify
LocationRouter.put('/:id', (req, res) => {
    LocationService.update(req.params.id, req.body)
        .then((location) => {
            res.status(200).send(location);
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

LocationRouter.post('/', (req, res) => {
    LocationService.create(Location.build(req.body))
        .then((location: Location) => {
            res.status(201).send(location);
        }).catch((err: Error) => {
            res.status(400).send({message: err.message});
        });
});

LocationRouter.delete('/:id', (req, res) => {
    LocationService.delete(req.params.id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            res.status(400).send({message: err.message});
        });
});

export { LocationRouter };