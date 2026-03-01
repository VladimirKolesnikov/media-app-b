import { setSeederFactory } from 'typeorm-extension';
import { MediaEntity } from 'src/media/entities/media.entity';

export default setSeederFactory(MediaEntity, async (faker) => {
    const media = new MediaEntity();
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'];
    media.originalName = faker.system.commonFileName(extensions[0]);
    // media.url = 'random/url';
    return media;
});