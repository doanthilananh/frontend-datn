import { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import clsx from "clsx";
import dayjs from "dayjs";
import { Form, useForm } from "@app/hooks/use-form.hook";
import { Category } from "@app/models/category.model";
import { Product, SizeDTO, UpdateSizeProductDTO } from "@app/models/product.model";
import { DEFAULT_DATETIME_FORMAT } from "@app/shared/constants/common";
import { titleCase } from "@core/helpers/string.helper";
import Controls from "../controls";

// const initialProductValues: UpdateProductDto = {
//   id: 0,
//   title: "",
//   longDescription: "",
//   price: 0,
//   author: "",
//   currentNumber: 0,
//   numberOfPage: 0,
//   quantityPurchased: 0,
//   categoryId: 0,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };
const initSizeDTO : SizeDTO = {
  size : "",
  quantity : 0
}

const initialSizeProductValues : UpdateSizeProductDTO = {
  id : 0,
  sizes : [initSizeDTO]
}
type PropTypes = {
  isEdit: boolean;
  isView: boolean;
  recordForAction: Product;
  addOrEdit: (values: UpdateSizeProductDTO, resetForm: () => void) => void;
  categories: Category[];
};

function SizeProductForm(props: PropTypes) {
  const { isEdit, isView, recordForAction, addOrEdit, categories } = props;

  if (recordForAction.id) {
    initialSizeProductValues.id = recordForAction.id;
  }


  const validate = (fieldValues = values) => {
    const temp = { ...errors };

    if ("XS" in fieldValues) {
      temp.size = fieldValues.size > 0 ? "" : "Trường này phải lớn hơn 0";
    }


    if ("S" in fieldValues) {
      temp.size = fieldValues.size > 0 ? "" : "Trường này phải lớn hơn 0";
    }
 
    if ("M" in fieldValues) {
      temp.size = fieldValues.size > 0 ? "" : "Trường này phải lớn hơn 0";
    }


    if ("L" in fieldValues) {
      temp.size = fieldValues.size > 0 ? "" : "Trường này phải lớn hơn 0";
    }

    setErrors({
      ...temp,
    });

    return fieldValues === values && Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialSizeProductValues, true, validate);
  
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEdit) {
      if (validate()) {
        addOrEdit({
          id : values.id,
          sizes : [{
            size : "XS",
            quantity : xs !== 0 ? xs : quantitySize("XS")
          },
          {
            size : "S",
            quantity :  s !== 0 ? s : quantitySize("S")
          },
          {
            size : "M",
            quantity :  m !== 0 ? m : quantitySize("M")
          },
          {
            size : "L",
            quantity :  l !== 0 ? l : quantitySize("L")
          },
        ]
        }, resetForm);
      }
      return;
    }
    if (validate()) {
      addOrEdit(values, resetForm);
    }
  };

  useEffect(() => {
    if ((isView || isEdit) && recordForAction.id) {
      setValues({
        ...recordForAction,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordForAction, isView, isEdit]);
  
  const quantitySize = (size:string) => {
    if(values.sizes.length > 1)
    {
      const sizeDTO : SizeDTO = values.sizes.find(value => value.size===size)
      return sizeDTO.quantity;
    }
    return 0;
  }
  const [xs, setXS] = useState(quantitySize("XS"));
  const [s, setS] = useState(quantitySize("S"));
  const [m, setM] = useState(quantitySize("M"));
  const [l, setL] = useState(quantitySize("L"));

  const handleChangeXS = (e) => {
    setXS(e.target.value);
  }
  
  const handleChangeS = (e) => {
    setS(e.target.value);
  }
  
  const handleChangeM = (e) => {
    setM(e.target.value);
  }
  
  const handleChangeL = (e) => {
    setL(e.target.value);
  }
  
  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12} style={{display:'flex', flexDirection:'row'}}>
          {/* <Controls.Input
            name="title"
            label="Tiêu đề"
            value={recordForAction.title}
            InputProps={{
              readOnly: true,
            }}
          />
          */}
          {/* <Controls.Input
            name="price"
            label="Giá"
            value={values.price}
            onChange={handleInputChange}
            error={errors.price}
            type="number"
            InputProps={{
              inputProps: { min: 0 },
              readOnly: isView,
            }}
          /> */}
          {/* <Controls.Input
            name="author"
            label="Tác giả"
            value={values.author}
            onChange={handleInputChange}
            error={errors.author}
            InputProps={{
              inputProps: { min: 0 },
              readOnly: isView,
            }}
          /> */}
          {/* {isView && (
            <Controls.Select
              name="categoryId"
              label="Thể loại"
              value={values.categoryId ? values.categoryId : ""}
              onChange={handleInputChange}
              options={categoryItems()}
              error={errors.categoryId}
              disabled={isView}
              className={clsx({ "bs-text-black": isView })}
            />
          )} */}
         <Grid style={{display:'flex', flexDirection:'row'}}>
        <Controls.Input
            name="XS"
            label="Size XS"
            multiline
            maxRows={8.5}
            value={xs!==0 ? xs : quantitySize("XS")}
            onChange={handleChangeXS}
            error={errors.longDescription}
            InputProps={{
              readOnly: isView,
            }}
          />
             <Controls.Input
            name="S"
            label="Size S"
            multiline
            maxRows={8.5}
            value={s!==0 ? s : quantitySize("S")}
            onChange={handleChangeS}
            error={errors.longDescription}
            InputProps={{
              readOnly: isView,
            }}
          />
           <Controls.Input
            name="M"
            label="Size M"
            multiline
            maxRows={8.5}
            value={m!==0 ? m : quantitySize("M")}
            onChange={handleChangeM}
            error={errors.longDescription}
            InputProps={{
              readOnly: isView,
            }}
          />
           <Controls.Input
            name="L"
            label="Size L"
            multiline
            maxRows={8.5}
            value={l!==0 ? l : quantitySize("L")}
            onChange={handleChangeL}
            error={errors.longDescription}
            InputProps={{
              readOnly: isView,
            }}
          />
         </Grid>
        </Grid>
        <Grid item xs={6}>
          {/* <Controls.Input
            name="currentNumber"
            label="còn"
            value={values.currentNumber}
            onChange={handleInputChange}
            error={errors.currentNumber}
            type="number"
            InputProps={{
              inputProps: { min: 0 },
              readOnly: isView,
            }}
          /> */}
          {/* <Controls.Input
            name="numberOfPage"
            label="Số trang"
            value={values.numberOfPage}
            onChange={handleInputChange}
            error={errors.numberOfPage}
            type="number"
            InputProps={{
              inputProps: { min: 0 },
              readOnly: isView,
            }}
          /> */}
          {/* {isView && (
            <Controls.Input
              name="quantityPurchased"
              label="đã mua"
              value={values.quantityPurchased}
              disabled
              InputProps={{
                readOnly: isView,
                classes: {
                  disabled: "bs-text-black",
                },
              }}
            />
          )} */}
          {/* {!isView && (
            <Controls.Select
              name="categoryId"
              label="Thể loại"
              value={values.categoryId ? values.categoryId : ""}
              onChange={handleInputChange}
              options={categoryItems()}
              error={errors.categoryId}
              disabled={isView}
              className={clsx({ "bs-text-black": isView })}
            />
          )} */}
          {/* {isView && (
            <>
              <Controls.Input
                name="createdAt"
                label="Được tạo lúc"
                value={dayjs(values.createdAt).format(DEFAULT_DATETIME_FORMAT)}
                InputProps={{
                  readOnly: isView,
                }}
              />
              <Controls.Input
                name="updatedAt"
                label="Được cập nhật lúc"
                value={dayjs(values.updatedAt).format(DEFAULT_DATETIME_FORMAT)}
                InputProps={{
                  readOnly: isView,
                }}
              />
            </>
          )} */}
        </Grid>
        {!isView && (
          <Grid item xs={12} style={{ marginTop: "1em" }}>
            <div style={{ textAlign: "center" }}>
              <Controls.Button type="submit" text="Gửi đi" />
              <Controls.Button
                text="Đặt lại"
                color="default"
                onClick={resetForm}
              />
            </div>
          </Grid>
        )}
      </Grid>
    </Form>
  );
}

export default SizeProductForm;
