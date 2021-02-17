import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	BaseEntity,
	ObjectIdColumn,
	ObjectID,
} from "typeorm";

@Entity()
export class Post extends BaseEntity {
	@ObjectIdColumn()
	id: ObjectID;

	@Column()
	title: string;

	@Column()
	text: string;

	@Column()
	date: string;
}
