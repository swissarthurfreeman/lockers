import Router from "express";
import { LocationService } from "../../domain/service/LocationService";
import { Location } from "../../domain/model/Location";

const LocationRouter = Router();

LocationRouter.get('/', async (req, res) => {
    // TODO : validate query ?
    res.send(await Location.findAll({where: req.query}));
});

LocationRouter.get('/:id', async (req, res) => {
    res.send(await Location.findByPk(req.params.id));
});

LocationRouter.put('/:id', async (req, res) => {
    const loc = await Location.findByPk(req.params.id);
    if(loc == null) {
        res.status(404).send({message: "Location does not exist"});
    } else {
        loc.update(req.body)
            .then((loc: Location) => {
                res.status(200).send(loc);
            })
            .catch((err) => {
                res.status(400).send({message: err.message});
            });
    }
});

LocationRouter.post('/', async (req, res) => {
    LocationService.create(Location.build(req.body))
        .then((location: Location) => {
            res.status(201).send(location);
        }).catch((err: Error) => {
            res.status(400).send({message: err.message});
        });
});

// TODO : make sure no lockers at present at location.
LocationRouter.delete('/:id', async (req, res) => {
    Location.destroy({where: {locationId: req.params.id}})
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            res.status(500).send({message: "Resource deletion error"});
        });
});

export { LocationRouter };