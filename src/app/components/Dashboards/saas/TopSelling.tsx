import { Box, Card, Pagination, Rating } from "@mui/material";
import FlexBox from "../../flexbox";
import { H5, Small } from "../../typography/typography";
import { FC, useState, useEffect, createRef } from "react";
import useObservable from "@core/hooks/use-observable.hook";
import { Product } from "@app/models/product.model";
import ProductService, { ProductPaginationOption } from "@app/services/http/product.service";
import { ProductRate } from "@app/models/product-rate.model";
import ProductRateService from "@app/services/http/product.rate.serive";
import { buildImageSrc } from "@app/shared/helpers/helpers";
import { DEFAULT_PAGINATION_OPTION, imageNotFound } from "@app/shared/constants/common";
import { NavLink, useLocation } from "react-router-dom";
import CategoryService from "@app/services/http/category.service";
import { PaginationOption } from "@core/services/http/http.service";
import { switchMap } from "rxjs";
import { useStyles } from "../make-style";
import RatingR from "@app/components/rating";

const TopSelling: FC = () => {
 const [products, setProducts] =useState<Product[]>([]);
//  useEffect(()=>{
//   subscribeOnce(ProductService.getListSellProducts(), (data)=>{
    
//     setProducts(data as unknown as Product[]);
//   })
//  }, [])
 let count = 1;
 
 
 const classes = useStyles();

 const location = useLocation();
 const { subscribeUntilDestroy, subscribeOnce } = useObservable();
 const query = new URLSearchParams(location.search);

 const [title, setTitle] = useState("");
 const [numberOfPage, setNumberOfPage] = useState(0);
 const [product, setProduct] = useState<Product[]>([]);
 const [textBreadcrumbs, setTextBreadcrumbs] = useState("");
 const [pagination, setPagination] = useState(() => {
   const options: ProductPaginationOption = {
     ...DEFAULT_PAGINATION_OPTION,
     perPage: 4,
   };
   return options;
 });
 const [total, setTotal] = useState(0);
 const [rate, setRate] = useState(0);
 const [productRates, setproductRates] = useState<ProductRate[]>([]);

 const pageRef = createRef<HTMLDivElement>();
 

 useEffect(() => {
     const search = query.get("search");
     const mode = "top-selling";

    setTitle("Sản phẩm bán chạy");
    setTextBreadcrumbs("Sản phẩm bán chạy");


     const options: ProductPaginationOption = {
       ...pagination,
       ...(mode === "top-selling" && { sort: "-quantityPurchased" }),
       ...(search && { like: { title: search } }),
     };
     subscribeUntilDestroy(ProductService.getList(options), (response) => {
       const data = response.data as Product[];
       const total = response.pagination?.total || 0;
       const perPage = response.pagination?.perPage || 1;
       setProducts(data);
       setNumberOfPage(Math.ceil(total / perPage));
     });
     subscribeUntilDestroy(ProductRateService.getAllList(), (data)=>{
      setproductRates(data as unknown as ProductRate[]);
    })
   if (pageRef.current) {
     pageRef.current.scrollIntoView({ behavior: "smooth" });
   }

   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [pagination, query.get("search"), query.get("category")]);
 const onPageChange = (event: React.ChangeEvent<any>, page: number) => {
  const options: ProductPaginationOption = {
    ...pagination,
    page,
  };
  setPagination(options);
};


  const rating = (item)=>{
    const productRating : ProductRate[] = productRates.filter((productRate => {
      return productRate.product.id === item.id
    }))
    return productRating.reduce((tot, current)=>{
      return tot + current.value;
    }, 0)/productRating.length;
  }
  return (
    <Card sx={{ padding: "2rem", height: "100%" }}>
      <H5>Top sản phẩm bán chạy</H5>

      {products.length !== 0 && products.map((product, index) => (
        <NavLink to={`/products/${product.slug}`} key={product.id} style={{listStyle : 'none', textDecoration:'none', color : 'black', display:'flex', justifyContent:'space-between',
        alignItems : 'center'}}>
          <FlexBox key={product.id} mt="1.2rem">
          <img src={  !!product.productImages.length
                ? buildImageSrc(product.productImages[0].imageUrl)
                : imageNotFound } alt="Men Keds" width="90px" />

          <Box display="flex" flexDirection="column" ml="1rem">
            <Small>{product.title}</Small>
             <RatingR
              // name="read-only"
              // size="small"
              value={rating(product)}
              // readOnly
              // sx={{ my: "3px" }}
              text=""
            /> 
            <Small fontWeight={600}>{`${product.price.toLocaleString("vn")}đ`}</Small>
            <Small fontWeight={600}>{`Đã bán: ${product.quantityPurchased}`}</Small>

          </Box>
        </FlexBox>
        <h1>{pagination.page===1 ? (index+1) : (index+1+pagination.perPage)}</h1>
        </NavLink> 
       ))}
      <Pagination
            count={numberOfPage}
            onChange={onPageChange}
            page={pagination.page}
            color="primary"
            style={{ justifyContent: "center", display: "flex" }}
          />
    </Card>
  );
};

const productList = [
  {
    title: "Nike airmax 170",
    image: "/static/products/black-keds.png",
    price: 567,
    rating: 5,
  },
  {
    title: "Nike airmax 170",
    image: "/static/products/green-keds.png",
    price: 200,
    rating: 5,
  },
  {
    title: "Nike airmax 170",
    image: "/static/products/yellow-keds.png",
    price: 400,
    rating: 5,
  },
];

export default TopSelling;
