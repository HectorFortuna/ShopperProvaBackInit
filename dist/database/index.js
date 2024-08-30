import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.DB_NAME || 'dbname', process.env.DB_USER || 'user', process.env.DB_PASS || 'pass', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
});
export default sequelize;
