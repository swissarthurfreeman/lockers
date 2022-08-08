import { Table, Model, AllowNull, Column } from "sequelize-typescript";
import { BelongsTo, ForeignKey, PrimaryKey} from "sequelize-typescript";
import { DataType, Validate, Unique, IsEmail } from "sequelize-typescript";
import { Locker } from "./Locker";
import { ContractService } from "../service/ContractService";

@Table({timestamps: true})
class Contract extends Model {
    @BelongsTo(() => Locker)
    locker: Locker;

    @PrimaryKey
    @ForeignKey(() => Locker)
    @AllowNull(false)
    @Unique
    @Column(DataType.UUID)
    lockerId: string;   // a locker can have only one contract

    @AllowNull(false)
    @Column
    firstname: string;

    @AllowNull(false)
    @Column
    lastname: string;

    @AllowNull(false)
    @IsEmail    // a user can have multiple contracts
    @Column
    email: string;

    //eslint-disable-next-line
    @Validate({is: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i})
    @AllowNull(true)
    @Column
    phone_number: string;

    @AllowNull(false)
    @Column
    expiration: Date;

    @Column({
        type: DataType.VIRTUAL,
        get(this: Contract): string {
            return ContractService.status(this) // works with this
        }
    })
    status: string;
}

export { Contract };