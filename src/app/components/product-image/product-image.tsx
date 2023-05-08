import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';
import "./style.scss"
function ProductImage(props) {
    let images = [{
        original: "",
        thumbnail: "",
        thumbnailPosition: ""
    }];

    
    props.detail && props.detail.map(item => {
        images.push({
            original: `${item.imageUrl}`,
            thumbnail: `${item.imageUrl}`,
            thumbnailPosition: "top"
        })    
        })
    console.log(images);
    
    return (
        <div style={{maxWidth:'100%'}}>
            <ImageGallery items={images.filter(image=>image.original.length!=0)} />
        </div>
    )
}

export default ProductImage