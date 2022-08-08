import { Table, Model, AllowNull, Index, Column, PrimaryKey, DataType, Default } from "sequelize-typescript";

@Table({timestamps: false})
class Location extends Model {
    @PrimaryKey        // not automatically done for some reason
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    locationId: string;

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