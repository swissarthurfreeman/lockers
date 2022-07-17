import { Table, Column, Model, AllowNull, Validate, IsEmail, PrimaryKey, DataType, Default, Unique } from "sequelize-typescript";

@Table({timestamps: false})
class User extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    userId: string; // These names have to be the same accross models. Simply specifiying primary key is not enough.
    
    @AllowNull(false)
    @Column
    firstname: string;

    @AllowNull(false)
    @Column
    lastname: string;

    @AllowNull(false)
    @Unique
    @IsEmail
    @Column
    email: string;

    //eslint-disable-next-line
    @Validate({is: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i})
    @AllowNull(true)
    @Column
    phone_number: string;
}

export { User };