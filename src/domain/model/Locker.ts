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
    @AllowNull(false)
    @Column
    locationId: number;

    @Column({
        type: DataType.VIRTUAL,
        get(this: Locker): boolean {
            return this.OutOfServiceReason != null  // different from null means OutOfService true
        }
    })
    OutOfService: boolean;

    @AllowNull(true)
    @Column
    OutOfServiceReason: string;

    @AllowNull(false)
    @Default("unspecified")
    @Column
    dimensions: string;
}

export { Locker };