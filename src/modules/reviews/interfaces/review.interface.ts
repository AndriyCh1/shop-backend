export interface CreateReviewData {
  comment: string;
  rating: number;
}

export type UpdateReviewData = Partial<CreateReviewData>;
