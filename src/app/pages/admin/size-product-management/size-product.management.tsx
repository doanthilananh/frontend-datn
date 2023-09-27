import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Visibility as VisibilityIcon,
  Create as CreateIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@material-ui/icons";
import { useSnackbar } from "notistack";
import { useStyles } from "./make-style";
import useForceUpdate from "@core/hooks/use-force-update.hook";
import useObservable from "@core/hooks/use-observable.hook";
import {
  DEFAULT_PAGINATION_OPTION,
  FETCH_TYPE,
  TYPE_ALERT,
} from "@app/shared/constants/common";
import PopupDialog from "@app/components/popup-dialog";
import ConfirmDialog from "@app/components/confirm-dialog";
import {
  CreateProductDto,
  Product,
  UpdateProductDto,
  UpdateSizeProductDTO,
} from "@app/models/product.model";
import ProductService, {
  ProductPaginationOption,
} from "@app/services/http/product.service";
import ProductForm from "@app/components/product-form";
import { Category } from "@app/models/category.model";
import CategoryService, {
  CategoryPaginationOption,
} from "@app/services/http/category.service";
import { ResponseResult } from "@core/services/http/http.service";
import SizeProductForm from "@app/components/size-product-form";

function SizeProductManagement() {
  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const [forceUpdate, setForceUpdate] = useForceUpdate();
  const { subscribeOnce, subscribeUntilDestroy } = useObservable();

  const typingTimeoutRef = useRef<any>(null);

  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchState, setSearchState] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [recordForAction, setRecordForAction] = useState<any>(
    new Product(null)
  );
  const [pagination, setPagination] = useState(() => {
    const options: ProductPaginationOption = {
      ...DEFAULT_PAGINATION_OPTION,
    };
    return options;
  });

  useEffect(() => {
    subscribeUntilDestroy(ProductService.getList(pagination), (response) => {
      setProducts(response.data as Product[]);
      setTotal(response.pagination?.total || 0);
    });

    const options: CategoryPaginationOption = {
      ...DEFAULT_PAGINATION_OPTION,
      fetchType: FETCH_TYPE.ALL,
    };
    subscribeUntilDestroy(CategoryService.getList(options), (response) => {
      setAllCategories(response.data as Category[]);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, forceUpdate]);

  const onAddProductClick = () => {
    setIsView(false);
    setIsEdit(false);
    setRecordForAction(new Product(null));
    setIsOpenPopup(true);
  };

  const openViewDialog = (item: Product) => {
    const itemView: UpdateSizeProductDTO = {
      id: item.id,
      sizes : item.sizeProducts
    };
    setIsView(true);
    setIsEdit(false);
    setRecordForAction(itemView);
    setIsOpenPopup(true);
  };

  const openInPopup = (item: Product) => {
    const itemEdit: UpdateSizeProductDTO = {
      id: item.id,
      sizes : item.sizeProducts
    };
    setIsView(false);
    setIsEdit(true);
    setRecordForAction(itemEdit);
    setIsOpenPopup(true);
  };

  const addOrEdit = (values: UpdateSizeProductDTO, resetForm: () => void) => {
    if (isEdit) {
      const editProductId = values.id;
      console.log(values);
      
      const editProductBody: Partial<UpdateSizeProductDTO> = {
        sizes : values.sizes
      };
      subscribeOnce(
        ProductService.updateSizeProduct(editProductId, editProductBody),
        () => {
          enqueueSnackbar("Cập nhật sô lượng hàng thành công", {
            variant: TYPE_ALERT.SUCCESS,
          });
          resetForm();
          setIsOpenPopup(false);
          setRecordForAction(new Product(null));
          setForceUpdate();
        }
      );
    }
  };

  const openConfirmDialog = (item: Product) => {
    setConfirmDialogOpen(true);
    setRecordForAction(item);
  };

  const handleDeleteProduct = () => {
    subscribeOnce(ProductService.deleteProduct(recordForAction.id), () => {
      enqueueSnackbar("Xóa sản phẩm thành công", {
        variant: TYPE_ALERT.SUCCESS,
      });
      setForceUpdate();
    });
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    const newPagination: ProductPaginationOption = {
      ...pagination,
      page: newPage + 1,
    };
    setPagination(newPagination);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newPagination: ProductPaginationOption = {
      ...pagination,
      page: 1,
      perPage: +event.target.value,
    };
    setPagination(newPagination);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchState(value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      const newPaginationOption: ProductPaginationOption = {
        ...pagination,
        like: {
          title: value,
        },
      };
      setPagination(newPaginationOption);
    }, 500);
  };
  const quantity = (product : Product, size : string)=>{
    const sizeProduct = product.sizeProducts.filter(sizeP => sizeP.size===size);
    if(sizeProduct.length !==0)    
        return sizeProduct[0].quantity === undefined ? 0 : sizeProduct[0].quantity;
    return 0;
  }
  return (
    <Container maxWidth="xl" className={classes.container}>
      <Typography variant="h4" className={classes.screenName}>
        Quản lý kho hàng
      </Typography>
      <Box style={{ display: "flex" }}>
        {/* <Button variant="contained" color="primary" onClick={onAddProductClick}>
          Thêm hàng mới
        </Button> */}
        <PopupDialog
          title="Kho hàng của sản phẩm"
          openPopup={isOpenPopup}
          setOpenPopup={setIsOpenPopup}
        >
          <SizeProductForm
            isEdit={isEdit}
            isView={isView}
            recordForAction={recordForAction}
            addOrEdit={addOrEdit}
            categories={allCategories}
          />
        </PopupDialog>
        <TextField
          style={{ marginLeft: "1em" }}
          label="Tìm kiếm theo tên sản phẩm"
          variant="outlined"
          size="small"
          value={searchState}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          onChange={handleSearchChange}
        />
      </Box>
      <Paper style={{ marginTop: 10 }}>
        <TableContainer style={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell width="10%">STT</TableCell>
                <TableCell width="20%">Sản phẩm</TableCell>
                <TableCell width="10%">35</TableCell>
                <TableCell width="10%">36</TableCell>
                <TableCell width="10%">37</TableCell>
                <TableCell width="10%">38</TableCell>
                <TableCell width="10%" align="center">
                  Xem
                </TableCell>
                <TableCell width="10%" align="center">
                  Cập nhật
                </TableCell>
                {/* <TableCell width="10%" align="center">
                  Xóa
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {!!products.length &&
                products.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{quantity(item, "35")}</TableCell>
                    <TableCell>{quantity(item, "36")}</TableCell>
                    <TableCell>{quantity(item, "37")}</TableCell>
                    <TableCell>{quantity(item, "38")}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => openViewDialog(item)}>
                        <VisibilityIcon style={{ color: "black" }} />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => openInPopup(item)}>
                        <CreateIcon style={{ color: "black" }} />
                      </IconButton>
                    </TableCell>
                    {/* <TableCell align="center">
                      <IconButton onClick={() => openConfirmDialog(item)}>
                        <DeleteIcon style={{ color: "red" }} />
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={pagination.page - 1}
          rowsPerPage={pagination.perPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>
      {/* <ConfirmDialog
        title="Xóa sản phẩm?"
        open={confirmDialogOpen}
        setOpen={setConfirmDialogOpen}
        onConfirm={handleDeleteProduct}
      >
        {recordForAction &&
          "Bạn có muốn xóa sản phẩm: " + recordForAction.title}
        ?
      </ConfirmDialog> */}
    </Container>
  );
}

export default SizeProductManagement;
