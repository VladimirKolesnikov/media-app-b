import { UserEntity } from 'src/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import bcrypt from 'bcrypt';

export default setSeederFactory(UserEntity, async (faker) => {
    const user = new UserEntity();
    user.email = faker.internet.email();
    const defaultPassword = 'Password123';
    user.passwordHash = await bcrypt.hash(defaultPassword, 10);
    return user;
});