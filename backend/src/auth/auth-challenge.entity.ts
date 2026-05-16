import { User } from 'src/user/user.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity()
export class AuthChallenge extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: '' })
    challengeId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({default: "LOGIN_2FA"})
    type: string; // "LOGIN_2FA"

    @Column({nullable: true})
    expiresAt: Date;

    @Column({ default: 0 })
    attempts: number;

    @Column({ default: 5 })
    maxAttempts: number;

    @CreateDateColumn({nullable: true})
    createdAt: Date;
}
