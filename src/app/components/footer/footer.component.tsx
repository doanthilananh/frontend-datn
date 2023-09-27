import { Link } from "react-router-dom";
import { Grid, Button, Box, Container } from "@material-ui/core";
import {
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
} from "@material-ui/icons";
import { useSelector } from "react-redux";
import { GlobalState } from "@app/store";
import { useStyles } from "./make-style";
import Contact from "../contact";

import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';

function Footer() {

  return (
    <Container style={{backgroundColor:'#000000', marginTop:100, maxWidth:'100%', color:'white'}}>
    <section className=''>
      <MDBContainer style={{maxWidth:'100%'}}>
        <MDBRow style={{display:'flex', justifyContent:'space-between'}}>
          <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
            <h3>
              <MDBIcon icon="gem" className="me-3" />
              Vị trí cửa hàng
              <Contact/>
            </h3>
          </MDBCol>

          <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
            <h3 className='text-uppercase fw-bold mb-4'>Thông tin về chúng tôi</h3>
            <p>
            Chính sách giao nhận - Vận chuyển
            </p>
            <p>
              Hướng dẫn thanh toán

            </p>
            <p>
              Tra cứu đơn hàng

            </p>
            <p>
              Quy định bảo hành và sửa chữa
            </p>
          </MDBCol>

          <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
            <h3 className='text-uppercase fw-bold mb-4'>Sản phẩm</h3>
            <p>
              <a href='#!' style={{textDecoration:'none', color:'white'}}>
                Giày thể thao
              </a>
            </p>
            <p>
              <a href='#!' style={{textDecoration:'none', color:'white'}}>
                Sandal nữ
              </a>
            </p>
            <p>
              <a href='#!' style={{textDecoration:'none', color:'white'}}>
                Giày cao gót
              </a>
            </p>
            <p>
              <a href='#!' style={{textDecoration:'none', color:'white'}}>
                Boot
              </a>
            </p>
          </MDBCol>

          <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
            <h3 className='text-uppercase fw-bold mb-4'>Liên hệ</h3>
            <p>
              <MDBIcon icon="home" className="me-2" />
              {` `}38 Nguyên Xá Minh Khai Hà Nội</p>
            <p>
              <MDBIcon icon="envelope" className="me-3" />
              {` `}shopminhthu@gmail.com
            </p>
            <p>
              <MDBIcon icon="phone" className="me-3" /> 0389863041
            </p>
            <p>
              <MDBIcon icon="print" className="me-3" /> 0969441658
            </p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>

    </Container>
  );
}

const selectAuth = (state: GlobalState) => state.auth;

export default Footer;
