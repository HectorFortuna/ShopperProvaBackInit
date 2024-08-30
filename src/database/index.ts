import { Sequelize } from 'sequelize';

const mockEnv = {
    DB_NAME: 'test_db',
    DB_USER: 'test_user',
    DB_PASS: 'test_pass',
    DB_HOST: 'localhost',
};

Object.assign(process.env, mockEnv);

const sequelize = new Sequelize(process.env.DB_NAME || 'dbname', process.env.DB_USER || 'user', process.env.DB_PASS || 'pass', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
});

export default sequelize;