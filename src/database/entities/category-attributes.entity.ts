import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { AllowedAttribute } from './allowed-attributes.entity';
import { Category } from './categories.entity';

@Entity('category_attributes')
export class CategoryAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  @Index()
  @ManyToOne(() => AllowedAttribute, (attribute) => attribute.id)
  attribute: AllowedAttribute;
}
