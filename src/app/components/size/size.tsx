import React, { useState } from 'react';
import Button from '../controls/button.control';
import { useEffect } from "react";
import useObservable from "@core/hooks/use-observable.hook";

import "./style.scss";
import SizeProductService from '@app/services/http/size.product.service';
const SizeSelector = (props) => {
  const [selectedSize, setSelectedSize] = useState('');
  const { subscribeOnce, subscribeUntilDestroy } = useObservable();
  const [quantity, setQuantity] = useState(0);
 

  const HandleSizeChange = (e) => {
    setSelectedSize(e.target.value);

    props.callback(e.target.value);
  };
  useEffect(()=>{
    if(props.id){
        subscribeOnce(SizeProductService.getAllQuantityBySizeAndProductId(selectedSize || "XS", props.id), (data)=>{
            props.setQuantity(data);
        })
    }
}, [selectedSize]);
  return (
    <div >
      <div style={{display:'flex', justifyContent:'space-between'}} className="label">
        <label className={selectedSize === "XS" ? 'activesss sd' : ''}>
          <input type="radio" name="size" value="XS" checked={selectedSize === 'XS'} onChange={HandleSizeChange} />
          XS
          {selectedSize === "XS" && (
              <img
                src="//theme.hstatic.net/200000182297/1000887316/14/select-pro1.png?v=567"
                style={{position:'absolute', width:30, marginLeft:7}}
              />
            )}        </label>
        <label className={selectedSize === "S" ? 'activesss' : ''}>
          <input type="radio" name="size" value="S" checked={selectedSize === 'S'} onChange={HandleSizeChange} />
          S
          {selectedSize === "S" && (
              <img
                src="//theme.hstatic.net/200000182297/1000887316/14/select-pro1.png?v=567"
                style={{position:'absolute', width:30, marginLeft:17}}
              />
            )}  
        </label>
        <label className={selectedSize === "M" ? 'activesss' : ''}>
          <input type="radio" name="size" value="M" checked={selectedSize === 'M'} onChange={HandleSizeChange} />
          M
          {selectedSize === "M" && (
              <img
                src="//theme.hstatic.net/200000182297/1000887316/14/select-pro1.png?v=567"
                style={{position:'absolute', width:30, marginLeft:11}}
              />
            )}  
        </label>
        <label className={selectedSize === "L" ? 'activesss' : ''}>
          <input type="radio" name="size" value="L" checked={selectedSize === 'L'} onChange={HandleSizeChange} />
          L
          {selectedSize === "L" && (
              <img
                src="//theme.hstatic.net/200000182297/1000887316/14/select-pro1.png?v=567"
                style={{position:'absolute', width:30, marginLeft:17.5}}
              />
            )}  
        </label>
      </div>
    </div>
  );
};

export default SizeSelector;