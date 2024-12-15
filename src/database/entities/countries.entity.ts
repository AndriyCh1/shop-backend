import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 2 })
  iso: string;

  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'varchar', length: 80 })
  upperName: string;

  @Column({ type: 'char', length: 3, nullable: true })
  iso3?: string;

  @Column({ type: 'smallint', nullable: true })
  numCode?: number;

  @Column({ type: 'int' })
  phoneCode: number;
}
