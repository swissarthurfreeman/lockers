import Router from "express";
import { LocationService } from "../../domain/service/LocationService";
import { Location } from "../../domain/model/Location";

const LocationRouter = Router();

LocationRouter.get('/', async (req, res) => {
    res.send(await Location.findAll());
});

LocationRouter.get('/:id', async (req, res) => {
    res.send(await Location.findByPk(req.params.id));
})

LocationRouter.post('/', async (req, res) => {
    console.log("POSTING LOCATION");
    res.send(await LocationService.create(Location.build(req.body)));
});

export { LocationRouter };