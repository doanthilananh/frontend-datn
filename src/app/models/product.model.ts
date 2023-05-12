import { Model } from "./model";
import { Category } from "./category.model";
import { ProductImage } from "./product-image.model";
import { SizeProduct } from "./size.product.model";

export class Product extends Model {
  id: number;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: Category;
  productImages: ProductImage[];
  price: number;
  author: string;
  currentNumber: number;
  numberOfPage: number;
  sizeProducts: SizeProduct[];
  slug: string;
  quantityPurchased: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    super();
    this.fill(data);
  }
}

export interface CreateProductDto {
  title: string;
  longDescription: string;
  categoryId: number;
  price: number;
  author: string;
  currentNumber: number;
  numberOfPage: number;
}

export interface UpdateProductDto {
  id: number;
  title: string;
  longDescription: string;
  categoryId: number;
  price: number;
  author: string;
  currentNumber: number;
  numberOfPage: number;
  quantityPurchased: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateSizeProductDTO{
  id : number;
  sizes : SizeDTO[];
}

export interface SizeDTO{
  size : string;
  quantity: number;
}