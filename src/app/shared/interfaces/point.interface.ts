import {Image} from './image.interface';
import {LngLat} from 'mapbox-gl';

export interface Point {
  capacity?: number;
  category: string;
  cockCapacity?: number;
  coord?: LngLat;
  file?: Image;
  galaCapacity?: number;
  id?: string;
  otherCategory?: string;
  stars?: number;
  title: string;
}
