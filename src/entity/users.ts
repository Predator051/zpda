import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ObjectIdColumn,
	ObjectID,
} from "typeorm";

@Entity()
export class User extends BaseEntity {
	@ObjectIdColumn()
	id: ObjectID;

	@Column()
	chatId: number;
}
