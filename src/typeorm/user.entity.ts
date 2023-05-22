import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    name: 'first_name',
    nullable: false,
    default: '',
  })
  first_name: string;

  @Column({
    name: 'last_name',
    nullable: false,
    default: '',
  })
  last_name: string;

  @Column({
    name: 'username',
    nullable: false,
    default: '',
  })
  username: string;

  @Column({
    name: 'password',
    nullable: false,
    default: '',
  })
  password: string;

  @Column({
    name: 'salt',
    nullable: false,
    default: '',
  })
  salt: string;

  @Column({
    name: 'created-at',
  })
  created_at: string;
}

