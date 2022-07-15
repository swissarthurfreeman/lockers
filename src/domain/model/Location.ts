import { Table, Model, AllowNull, Index, Column, ForeignKey } from "sequelize-typescript";
import { Locker } from "./Locker";

@Table
class Location extends Model {
    @ForeignKey(() => Locker)
    uuid: string;

    @Index("unique-site-location")
    @AllowNull(false)
    @Column
    site: string;
    
    @Index("unique-site-location")
    @AllowNull(false)
    @Column
    name: string;
}

export { Location };