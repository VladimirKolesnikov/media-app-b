import { MediaEntity } from "src/media/entities/media.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";


export default class UserSeeder implements Seeder {
    track?: boolean | undefined;
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
        const userFactory = await factoryManager.get(UserEntity);
        const mediaFactory = await factoryManager.get(MediaEntity);

        const users = await userFactory.saveMany(10);

        for (const user of users) {
            await mediaFactory.saveMany(2, { user })
        }

        // For a case with adding a single instance:

        // const repository = dataSource.getRepository(UserEntity);
        // await repository.insert([{
        //     email: '...',
        //     passwordHash: '...'
        // }]);

        console.log('✅✅✅✅✅✅✅✅     Users with media seeded successfully!    🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉');
    }
} 