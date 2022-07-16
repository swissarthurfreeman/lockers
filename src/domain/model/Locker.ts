import { Table, Column, Model, AllowNull, ForeignKey, BelongsTo, Index, PrimaryKey, IsUUID, DataType, Default } from "sequelize-typescript";
import { Location } from "./Location";

@Table({timestamps: false})
class Locker extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    lockerId: string;

    //@Index("unique-num-at-loc")
    @AllowNull(false)
    @Column(DataType.INTEGER)
    number: number;

    @AllowNull(false)
    @Column
    verticalPosition: string;

    @AllowNull(false)
    @Column
    lock: boolean;

    //@BelongsTo(() => Location)
    //location: Location;

    //@Index("unique-num-at-loc")
    //@ForeignKey(() => Location)
    //locationId: number;
}

export { Locker };