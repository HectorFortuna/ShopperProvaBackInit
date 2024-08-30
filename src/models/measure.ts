import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/index.js';

export class Measure extends Model {
    public measure_uuid!: string;
    public customer_code!: string;
    public measure_datetime!: Date;
    public measure_type!: string;
    public image_url!: string;
    public measure_value!: number;
    public has_confirmed!: boolean;
}

Measure.init({
    measure_uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
    },
    customer_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    measure_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    measure_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    measure_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    has_confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    tableName: 'measures',
});