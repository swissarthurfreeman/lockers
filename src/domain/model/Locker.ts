import { Table, Column, Model, AllowNull, HasOne, Index, ForeignKey, DataType } from "sequelize-typescript";
import { Contract } from "./Contract";
import { Location } from "./Location";

@Table
class Locker extends Model {
    @ForeignKey(() => Contract)
    uuid: string;

    @AllowNull(false)
    @Column
    number: number;

    @AllowNull(false)
    @Column
    verticalPosition: string;

    @AllowNull(false)
    @Column
    lock: boolean;

    @HasOne(() => Location)
    location: Location;
}

export { Locker };