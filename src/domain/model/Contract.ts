import { Table, Model, AllowNull, Column, BelongsTo, ForeignKey, PrimaryKey, DataType, Default } from "sequelize-typescript";
import { Locker } from "./Locker";
import { User } from "./User";

@Table({timestamps: false})
class Contract extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    contractId: string;

    @BelongsTo(() => Locker)
    locker: Locker; // TODO : test to see if returning this as response aggregates the locker into the response too

    @PrimaryKey
    @ForeignKey(() => Locker)
    @AllowNull(false)
    @Column(DataType.UUID)
    lockerId: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => User)
    @AllowNull(false)
    @Column(DataType.UUID)
    userId: string;

    @AllowNull(false)
    @Column
    expiration: Date;
}

export { Contract };