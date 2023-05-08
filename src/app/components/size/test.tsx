import React, { useState } from "react";
import styled from "styled-components";
import ReactImageMagnify from "react-image-magnify";
import { Box, makeStyles } from "@material-ui/core";
import { Container } from "react-bootstrap";
const useStyles = makeStyles(theme => ({
    smallImage: {
        paddingTop: theme.spacing(1),
        borderRadius: '4px',
    },
    active: {
        borderColor: theme.palette.primary.main
    }
}))
const MyImage = (props) => {
  const [mainImageId, setMainImageId] = useState(props.imgs[0].id);
  const mainImage = props.imgs.find((img) => img.id === mainImageId);

  return (
    <Wrapper>
     <div className="grid grid-four-column">
        {props.imgs.map((image) => {
          return (
            <figure>
              <img
                id = {`img-${image.id}`}
                src={image.imageUrl}
                alt={""}
                key={image.id}
                onClick={(e) => {
                    setMainImageId(image.id);
                    // handleClickImg(e);
                }}
                className={image.id === mainImageId ? 'active' : ''}
              />
            </figure>
          );
        })}
      </div>

      <Box className="main-screen">
            <ReactImageMagnify {...{
                smallImage: {
                    alt: "",
                    isFluidWidth: true,
                    // src: ${mainImage.imageUrl},
                },
                largeImage: {
                    // src: ${mainImage.imageUrl},
                    width: 2000,
                    height: 2000
                }
            }} />
        </Box>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 0.4fr 1fr;
  gap: 1rem;
  align-items: center;
    .grid {
    flex-direction: row;
    justify-items: center;
    align-items: center;
    width: 100%;
    gap: 4rem;
    /* order: 2; */

    img {
      max-width: 100px;
      max-height: 120px;
      background-size: cover;
      object-fit: contain;
      cursor: pointer;
    }
    img.active{
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
    }
  }

  .main-screen {
    place-items: center;
    order: 1;
      max-width: 1000px;
      height: auto;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;

  }
  .grid-four-column {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, 1fr);
  }

`;

export default MyImage;