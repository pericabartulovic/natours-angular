export interface Review {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  tour: string;
  user: {
    _id: string;
    name: string;
    photo: string;
  };
}
