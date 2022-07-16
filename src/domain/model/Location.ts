import { Table, Model, AllowNull, Index, Column, ForeignKey, PrimaryKey } from "sequelize-typescript";
import { Locker } from "./Locker";

@Table
class Location extends Model {
    @PrimaryKey
    @Column
    locationId: number;

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