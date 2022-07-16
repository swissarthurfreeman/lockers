import { Table, Model, AllowNull, Index, Column, PrimaryKey, Default, DataType, AutoIncrement } from "sequelize-typescript";

@Table({timestamps: false})
class Location extends Model {
    @PrimaryKey
    @AutoIncrement  // not automatically done for some reason
    @Column
    locationId: number;

    @Index({name: "unique-site-location", type: 'UNIQUE', unique: true})
    @AllowNull(false)
    @Column
    site: string;
    
    @Index({name: "unique-site-location", type: 'UNIQUE', unique: true})
    @AllowNull(false)
    @Column
    name: string;
}

export { Location };