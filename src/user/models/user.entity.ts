import { Exclude } from "class-transformer";
import { Role } from "src/auth/role.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    handle: string;

    @Column({unique: true})
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({default: Role.USER})
    role: Role;

    @Column({default: false})
    confirmed: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
