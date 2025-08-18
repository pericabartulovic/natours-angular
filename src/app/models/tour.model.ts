import { Location } from './location.model';
import { Guide } from './guide.model';
import { Review } from './review.model';

export interface Tour {
  _id: string;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: string[];
  secretTour: boolean;
  startLocation: Location;
  locations: Location[];
  guides: Guide[];
  slug: string;
  durationWeeks: number;
  reviews: Review[];
}
