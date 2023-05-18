import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    name: 'name',
    nullable: false,
    default: '',
  })
  name: string;

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
}
