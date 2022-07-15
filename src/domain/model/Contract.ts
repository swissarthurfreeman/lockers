import { Table, Model, AllowNull, Column, HasOne } from "sequelize-typescript";
import { Locker } from "./Locker";
import { User } from "./User";

@Table
class Contract extends Model {
    @HasOne(() => User)
    user: User;

    @HasOne(() => Locker)
    locker: Locker;

    @AllowNull(false)
    @Column
    date: Date;
}

export { Contract };