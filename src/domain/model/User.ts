import { Table, Column, Model, AllowNull, Validate, ForeignKey, HasMany, IsEmail } from "sequelize-typescript";
import isEmail from "validator/lib/isEmail";
import { Contract } from "./Contract";

@Table
class User extends Model {
    @ForeignKey(() => Contract) // reference that Contract can use and see
    uuid: string;

    //@HasMany(() => Contract)
    //contracts: Contract[];

    @AllowNull(false)
    @Column
    firstname: string;

    @AllowNull(false)
    @Column
    lastname: string;

    @AllowNull(false)
    @IsEmail
    @Column
    email: string;

    @AllowNull(true)
    //eslint-disable-next-line
    @Validate({is: /^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i})
    @Column
    phone_number: string;
}

export { User };