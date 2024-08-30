import { Model, DataTypes } from 'sequelize';
import sequelize from '../database/index.js';
export class Measure extends Model {
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
