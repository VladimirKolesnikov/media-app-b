import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import UserSeeder from './user-seeder';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserEntity } from '../user/entities/user.entity';
import { MediaEntity } from '../media/entities/media.entity';
import userFactory from './user-factory';
import mediaFactory from './media-factory';

dotenv.config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity, MediaEntity],
    factories: [userFactory, mediaFactory],
    seeds: [UserSeeder],
    namingStrategy: new SnakeNamingStrategy(),
};

export default new DataSource(dataSourceOptions);