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

export interface UpdateSizeProductDto {
  productId: number;
  sizes : SizeProductDTO[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SizeProductDTO{
  quantity: number;
  size : string;
}