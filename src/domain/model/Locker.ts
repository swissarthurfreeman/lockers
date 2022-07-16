import { Table, Column, Model, AllowNull, ForeignKey, BelongsTo, Index, PrimaryKey, DataType, Default } from "sequelize-typescript";
import { Location } from "./Location";

@Table({timestamps: false})
class Locker extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    lockerId: string;

    @Index({name: 'unique-num-at-loc', type: 'UNIQUE', unique: true})
    @AllowNull(false)
    @Column(DataType.INTEGER)
    number: number;

    @AllowNull(false)
    @Column
    verticalPosition: string;

    @AllowNull(false)
    @Column
    lock: boolean;

    @BelongsTo(() => Location)
    location: Location;
    
    // imposes unique column tuple constraint
    @Index({name: 'unique-num-at-loc', type: 'UNIQUE', unique: true})
    @ForeignKey(() => Location)
    locationId: number;
}

export { Locker };