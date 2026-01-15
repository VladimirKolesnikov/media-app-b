import { MediaEntity } from "src/media/entities/media.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: 'usr' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    type: 'varchar',
  })
  email: string;

  @Column({
    name: 'password_hash'
  })
  passwordHash: string;

  @OneToMany(() => MediaEntity, (media) => media.user, {
    onDelete: 'CASCADE',
  })
  media: MediaEntity[];

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt: Date;
}
