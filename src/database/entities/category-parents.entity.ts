import { Check, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { Category } from './categories.entity';

@Entity('category_parents')
@Check(`"parentId" <> "categoryId"`)
export class CategoryParent {
  @PrimaryColumn()
  categoryId: number;

  @PrimaryColumn()
  parentId: number;

  @Index()
  @ManyToOne(() => Category, (category) => category.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  category: Category;

  @ManyToOne(() => Category, (category) => category.id)
  parent: Category;
}
