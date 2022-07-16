import { Table, Model, AllowNull, Index, Column, PrimaryKey, Default, DataType, AutoIncrement } from "sequelize-typescript";

@Table
class Location extends Model {
    @PrimaryKey
    @AutoIncrement  // not automatically done for some reason
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