import { map } from "rxjs/operators";
import HttpService, { ResponseResult } from "@core/services/http/http.service";
import { SizeProduct } from "@app/models/size.product.model";
class _SizeProductService {
  public getCart() {
    return HttpService.get("/carts").pipe(
      map<any, ResponseResult>((response) => response.result)
    );
  }

  public getAllQuantityBySizeAndProductId(size : string, productId : number) {
    return HttpService.get(`/size-products/quantity/${productId}/?size=${size}`).pipe(
      map<any, number>((response) => response)
    );
  }
}

const SizeProductService = new _SizeProductService();
export default SizeProductService;
