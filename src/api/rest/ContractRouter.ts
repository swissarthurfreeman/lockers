import Router from "express";
import { Locker } from "../../domain/model/Locker";
import { Contract } from "../../domain/model/Contract";
import { User } from "../../domain/model/User";
import { ContractService } from "../../domain/service/ContractService";

const ContractRouter = Router();

ContractRouter.get('/', async (req, res) => {
    const lockers = await Contract.findAll();
    res.send(lockers);
});

ContractRouter.get('/:id', async (req, res) => {
    const contract = await Contract.findByPk(req.params.id);
    if(contract == null)
        res.status(404);
    res.send(contract);
});

ContractRouter.post('/', async (req, res) => {
    const locker = await Locker.findByPk(req.body.lockerId);
    let user = await User.findOne({ where: { email: req.body.user.email }});    
    if(locker == null) {
        res.status(400).send("Locker does not exist");
    } else {
        if(user == null) {
            user = await User.create({
                firstname: req.body.user.firstname,
                lastname: req.body.user.lastname,
                email: req.body.user.email
            });
        }
            ContractService.create(
                Contract.build({
                    lockerId: locker.lockerId,
                    userId: createdUser.userId,
                    expiration: new Date()
                })
            ).then((contract) => {
                res.status(201).send(contract);
            }).catch((reason) => {
                res.status(400).send(reason.message);
            });
        }); 
    }
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