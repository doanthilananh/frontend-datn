import React, { useEffect, useState, createRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Divider,
  Grid,
  Button,
  Typography,
  TextField,
  Paper,
} from "@material-ui/core";
import { Card } from 'react-bootstrap'
import {RadioButton, RadioGroup, ReversedRadioButton, View, RadioButtonGroup} from "react-radio-buttons";

import { Message, ShoppingCart as ShoppingCartIcon } from "@material-ui/icons";
import MuiImageSlider from "mui-image-slider";
import { switchMap } from "rxjs/operators";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { Helmet } from "react-helmet-async";
import { useStyles } from "./make-style";
import { Product } from "@app/models/product.model";
import AppBar from "@app/components/app-bar";
import MainSlider from "@app/components/main-slider";
import CustomBreadcrumbs from "@app/components/custom-breadcrumbs";
import useObservable from "@core/hooks/use-observable.hook";
import ProductService, {
  ProductPaginationOption,
} from "@app/services/http/product.service";
import Footer from "@app/components/footer";
import { buildImageSrc } from "@app/shared/helpers/helpers";
import { PaginationOption } from "@core/services/http/http.service";
import ProductItem from "@app/components/product-item";
import ViewService from "@app/services/view.service";
import { imageNotFound, TYPE_ALERT } from "@app/shared/constants/common";
import { CreateCartDto } from "@app/models/cart.model";
import CartService from "@app/services/http/cart.service";
import { fetchCart } from "@app/store/cart/cart.epic";
import useDestroy from "@core/hooks/use-destroy.hook";
import { GlobalState } from "@app/store";
import { Role } from "@app/shared/types/user.type";
import Rating from "@app/components/rating";
import { Row, Col, Image, ListGroup } from 'react-bootstrap'
import ProductRateService from "@app/services/http/product.rate.serive";
import { ProductRate, ProductRateDto } from "@app/models/product-rate.model";
import ProductRateComponent from "@app/components/product-rate";
import ProductImage from "@app/components/product-image/product-image";
import Size from "@app/components/size";
import CustomModal from "../sign-up/modal";



function ProductDetail() {
  const classes = useStyles();
  const [selectedOption, setSelectedOption] = useState('option1');

  function handleChange(event) {
    setSelectedOption(event.target.value);
  }
  const { id: userId, role: userRole } = useSelector(selectAuth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { destroy$ } = useDestroy();
  const { subscribeOnce, subscribeUntilDestroy } = useObservable();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(new Product(null));
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [lastViewProducts, setLastViewProducts] = useState<Product[]>([]);

  const pageRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (slug) {
      subscribeUntilDestroy(
        ProductService.getDetail(slug).pipe(
          switchMap((product) => {
            setProduct(product);
            setQuantity(1);
            const options: PaginationOption = {
              page: 1,
              perPage: 4,
            };
            return ProductService.getListByCategory(
              product.category.id,
              options
            );
          })
        ),
        (response) => {
          setSimilarProducts(response.data as Product[]);
        }
      );
    }

    const lastViewIds = ViewService.getLastView();
    if (!!lastViewIds.length) {
      const options: ProductPaginationOption = {
        page: 1,
        perPage: 4,
        ids: lastViewIds,
      };
      subscribeUntilDestroy(ProductService.getList(options), (response) => {
        setLastViewProducts(response.data as Product[]);
      });
    }

    if (pageRef.current) {
      pageRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const onQuantityChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(+ev.target.value);
  };

  const [size, setSize] = useState("");

  const callbackSize = (childSize)=>{
    setSize(childSize);
  }

  const onAddToCartClick = () => {
    if (!userId) {
      navigate(
        {
          pathname: "/login",
          search: `?backUrl=/products/${product.slug}`,
        },
        {
          replace: true,
        }
      );
      return;
    }

    if (userRole !== Role.MEMBER) {
      enqueueSnackbar("Bạn không thể thêm sản phẩm vào giỏ hàng", {
        variant: TYPE_ALERT.WARNING,
      });
      return;
    }

    if (quantity <= 0) {
      enqueueSnackbar("Số lượng không hợp lệ", {
        variant: TYPE_ALERT.WARNING,
      });
      return;
    }

    const cartDto: CreateCartDto = {
      productId: product.id,
      quantity,
      size : size,
    };
    subscribeOnce(CartService.addToCart(cartDto), () => {
      dispatch(fetchCart({ destroy$ }));
      enqueueSnackbar("Thêm vào giỏ hàng thành công", {
        variant: TYPE_ALERT.SUCCESS,
      });
    });
  };
  const [total, setTotal] = useState(0);
  const [productRates, setProductRates] = useState<ProductRate[]>([]);
    useEffect(() => {
      if(product.id !== undefined)
        subscribeOnce(ProductRateService.getList(product?.id), (response) => {
          setProductRates(response.data as ProductRate[]);
          setTotal(response.pagination?.total || 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);
  const [q, setQ] = useState(0);
  const callbackQuantity = (childData) => {
    setQ(childData);
  }
  const [isOpen, setIsOpen] = useState(false);
  const handleDialogClose = ()=>{
    setIsOpen(false);
  }
  const handleDialogOpen = ()=>{
    setIsOpen(true);
  }

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>{product.title && product.title}</title>
      </Helmet>
      <AppBar />
      <Box paddingTop={2}>
        {product.category?.name && (
          <CustomBreadcrumbs
            navigation={[
              { title: "Trang chủ", linkTo: "/" },
              { title: "Thể loại", linkTo: "/categories" },
              {
                title: product.category.name,
                linkTo: `/products?category=${product.category.slug}`,
              },
            ]}
            textPrimary={product.title}
          />
        )}
      </Box>
      <MainSlider isShowBanner={false} />
      <Box
        paddingTop={4}
        paddingX={5.5}
        maxWidth="992px"
        style={{ margin: "0 auto", display: "flex" }}
      >
        <Grid item xs={8} sm={8} style={{marginRight:50}}>
          <Box>
            {!!product.productImages?.length && (
              // <MuiImageSlider
              //   images={product.productImages.map((item) =>
              //     buildImageSrc(item.imageUrl)
              //   )}
              //   classes={{ root: classes.wrapper }}
              // />
        
                    <ProductImage detail={product.productImages} />

            )}
            {!product.productImages?.length && (
              <img
                src={imageNotFound}
                alt="Not found"
                style={{ width: "100%", height: "500px" }}
              />
            )}
          </Box>
        </Grid>
        <Grid item xs={8} sm={8}>
          <Box paddingTop={2} paddingX={3}>
            <Typography variant="h6" color="textPrimary">
              {product.title}
            </Typography>
            <Divider />
            <Box style={{ display: "flex", flexDirection:'column' }}>
              <Grid item xs={7} sm={7}>
                <div style={{display:'flex', flexDirection:'column', marginBottom:30}}>
                <span>Thương hiệu: Hàng cao cấp</span>
                <span>Mã sản phẩm: {product.id}</span>
                </div>
                <Typography variant="h4" style={{fontWeight:'bold'}} color="textPrimary">
              {product.price && `${product.price.toLocaleString("vn")} đ`}
            </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                style={{ textAlign: "left", marginTop: "1em" }}
              >
            <Box style={{marginBottom:30}}>
            <Typography variant="h6" style={{fontSize:15}} color="textPrimary">
              Kích thước
            </Typography>
               <Size callback={callbackSize} id={product.id} setQuantity={callbackQuantity}/>
            </Box>
            <span style={{cursor:'pointer', textDecoration:'underline'}} onClick={handleDialogOpen}>
              HƯỚNG DẪN CHỌN SIZE
            </span>
                <Box style={{ marginTop: "2em"}}>
                  <div style={{display:'flex', alignItems:'center'}}>
                  <TextField
                    onChange={onQuantityChange}
                    size="small"
                    id="outlined-number"
                    label="Số lượng"
                    type="number"
                    value={quantity}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{ inputProps: { min: 1 } }}
                    style={{ width: "11em" }}
                    variant="outlined"
                  />
                  <span style={{marginLeft:10}}>{size.length !== 0 ? `${q} sản phẩm có sẵn` : ""}</span>
                  </div>
                  <Box>
                    <Button
                    style={{backgroundColor:'#000000', marginTop:30, marginBottom:30}}
                      variant="contained"
                      color="primary"
                      startIcon={<ShoppingCartIcon />}
                      className={classes.btnAddToCart}
                      onClick={onAddToCartClick}
                    >
                      Thêm vào giỏ
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Box>
            <Divider />
            <Box style={{textAlign:'justify'}}>
     
            <Typography variant="h6"  color="textPrimary">
              Giới thiệu sản phẩm
            </Typography>
            <span>{product.longDescription}</span>
            </Box>
          </Box>
        </Grid>

      </Box>
      <ProductRateComponent id={product.id}/>      

      <Box
        paddingTop={10}
        // paddingX={5.5}
        maxWidth="930px"
        style={{ margin: "0 auto" }}
      >
        <Typography
          variant="h6"
          color="textPrimary"
          style={{
            margin: "0 auto",
            // background: "#EBE9E9",
            padding: "0.2em",
          }}
        >
          Sản phẩm tương tự
        </Typography>
        <Box marginTop={2}>
          <div>
            <Grid container spacing={1}>
              {!!similarProducts.length &&
                similarProducts.map((item, index) => (
                  <Grid key={index} item xs={6} sm={3}>
                    <ProductItem item={item} />
                  </Grid>
                ))}
            </Grid>
          </div>

          <Box className={classes.showMoreBox}>
            <Link
              to={
                product.category
                  ? `/products?category=${product.category.slug}`
                  : ""
              }
              className={classes.showMoreLink}
            >
              <Button variant="contained">Xem thêm</Button>
            </Link>
          </Box>
        </Box>
      </Box>
      {!!lastViewProducts.length && (
        <Box
          paddingTop={5}
          // paddingX={5.5}
          maxWidth="930px"
          style={{ margin: "0 auto" }}
        >
          <Typography
            variant="h6"
            color="textPrimary"
            style={{
              margin: "0 auto",
              // background: "#EBE9E9",
              padding: "0.2em",
            }}
          >
            Sản phẩm đã xem
          </Typography>
          <Box marginTop={2}>
            <div>
              <Grid container spacing={1}>
                {!!lastViewProducts.length &&
                  lastViewProducts.map((item, index) => (
                    <Grid key={index} item xs={6} sm={3}>
                      <ProductItem item={item} />
                    </Grid>
                  ))}
              </Grid>
            </div>

            <Box className={classes.showMoreBox}>
              <Link to="/products-viewed" className={classes.showMoreLink}>
                <Button variant="contained">Xem thêm</Button>
              </Link>
            </Box>
          </Box>
        </Box>
      )}
           <CustomModal isOpen={isOpen} handleClose={handleDialogClose} title="HƯỚNG DẪN CHỌN SIZE">
        <div>
            <p>Vui lòng kiểm tra email để xác thực tài khoản
            </p>
          </div>
        </CustomModal>
      <Footer />
    </div>
  );
}

const selectAuth = (state: GlobalState) => state.auth;

export default ProductDetail;
