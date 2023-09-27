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
        subscribeOnce(SizeProductService.getAllQuantityBySizeAndProductId(selectedSize || "35", props.id), (data)=>{
            props.setQuantity(data);
        })
    }
}, [selectedSize]);
  return (
    <div >
      <div style={{display:'flex', justifyContent:'space-between'}} className="label">
        <label className={selectedSize === "35" ? 'activesss sd' : ''}>
          <input type="radio" name="size" value="35" checked={selectedSize === '35'} onChange={HandleSizeChange} />
          35
          {selectedSize === "35" && (
              <img
                src="//theme.hstatic.net/200000182297/1000887316/14/select-pro1.png?v=567"
                style={{position:'absolute', width:30, marginLeft:7}}
              />
            )}        </label>
        <label className={selectedSize === "36" ? 'activesss' : ''}>
          <input type="radio" name="size" value="36" checked={selectedSize === '36'} onChange={HandleSizeChange} />
          36
          {selectedSize === "36" && (
              <img
                src="//theme.hstatic.net/200000182297/1000887316/14/select-pro1.png?v=567"
                style={{position:'absolute', width:30, marginLeft:17}}
              />
            )}  
        </label>
        <label className={selectedSize === "37" ? 'activesss' : ''}>
          <input type="radio" name="size" value="37" checked={selectedSize === '37'} onChange={HandleSizeChange} />
          37
          {selectedSize === "37" && (
              <img
                src="//theme.hstatic.net/200000182297/1000887316/14/select-pro1.png?v=567"
                style={{position:'absolute', width:30, marginLeft:11}}
              />
            )}  
        </label>
        <label className={selectedSize === "38" ? 'activesss' : ''}>
          <input type="radio" name="size" value="38" checked={selectedSize === '38'} onChange={HandleSizeChange} />
          38
          {selectedSize === "38" && (
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