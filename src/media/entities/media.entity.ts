import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MediaLoadStatus } from "../types/mediaLoadStatus";

@Entity({ name: 'media' })
export class MediaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    // type: 'enum',
    // enum: MediaLoadStatus,
    type: 'varchar',
    default: MediaLoadStatus.PENDING,
  })
  // status: MediaLoadStatus;
  status: string;

  @Column({
    name: 'original_name',
    type: 'varchar',
  })
  originalName: string;

  // @Column({
  //   type: 'varchar',
  // })
  // url: string;

  @ManyToOne(() => UserEntity, (user) => user.media, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}
