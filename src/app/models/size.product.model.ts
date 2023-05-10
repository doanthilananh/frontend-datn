import { Model } from "./model";

export class SizeProduct extends Model {
  id: number;
  size: string;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  constructor(data: any) {
    super();
    this.fill(data);
  }
}
