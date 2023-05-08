import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Container,
  Typography,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import {
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { useStyles } from "./make-style";
import AuthService from "@app/services/http/auth.service";
import useObservable from "@core/hooks/use-observable.hook";
import StorageService from "@core/services/storage";
import { CreateUserDto, User } from "@app/models/user.model";
import { storeUser } from "@app/store/auth/auth.action";
import HttpService from "@core/services/http/http.service";
import CustomModal from "./modal";
import { useSelector } from 'react-redux';
import { useSnackbar } from "notistack";
import { TYPE_ALERT } from "@app/shared/constants/common";

export default function SignUp() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscribeOnce } = useObservable();

  const [showPassword, setShowPassword] = useState(false);
  const [userDto, setUserDto] = useState<CreateUserDto>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
  });

  // useEffect(() => {
  //   const token = HttpService.getAccessToken() || "";

  //   subscribeOnce(AuthService.validate(token), (data) => {
  //     dispatch(storeUser(new User(data.result?.data.user)));
  //     StorageService.set("access_token", data.result?.data.jwt);
  //     StorageService.set("role", data.result?.data.user.role);
  //     navigate("/", { replace: true });
  //   });

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = () => {
    subscribeOnce(AuthService.signUp(userDto), (response) => {
      dispatch(storeUser(new User(response.result?.data.user)));
      StorageService.set("access_token", response.result?.data.jwt);
      StorageService.set("role", response.result?.data.user.role);
      handleDialogOpen();
      enqueueSnackbar(`Đăng ký tài khoản thành công`, {
        variant: TYPE_ALERT.SUCCESS,
      });
      setTimeout(()=>{
        navigate("/login", { replace: true });

      }, 2000)
    
    });
  };

  const onValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name;
    setUserDto({ ...userDto, [field]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

    
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const [isOpen, setIsOpen] = useState(false);
  const handleDialogClose = ()=>{
    setIsOpen(false);
  }
  const handleDialogOpen = ()=>{
    setIsOpen(true);
  }
  return (
    <>
      <Helmet>
        <title>Đăng ký</title>
      </Helmet>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar} >
          </Avatar>
          <Typography component="h1" variant="h5">
            Đăng ký
          </Typography>
          <p>Hãy đăng ký ngay để tích lũy điểm thành viên và nhận được những ưu đãi tốt hơn!</p>
          <div className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="Họ đệm"
                  value={userDto.firstName}
                  onChange={onValueChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Tên"
                  name="lastName"
                  value={userDto.lastName}
                  onChange={onValueChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Tên đăng nhập"
                  name="username"
                  value={userDto.username}
                  onChange={onValueChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={userDto.password}
                  onChange={onValueChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={7}>
                <TextField
                  name="email"
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  value={userDto.email}
                  onChange={onValueChange}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="phone"
                  label="Số điện thoại"
                  name="phone"
                  value={userDto.phone}
                  onChange={onValueChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="address"
                  label="Địa chỉ"
                  id="address"
                  value={userDto.address}
                  onChange={onValueChange}
                />
              </Grid>
            </Grid>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              style={{background:'#000000'}}
              className={classes.submit}
              onClick={()=>{
                onSubmit();
              }}
            >
              Đăng ký
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" className="" style={{color:'black'}}>
                  Đăng nhập
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
        {/* <CustomModal isOpen={isOpen} handleClose={handleDialogClose} title="Bạn cần xác thực tài khoản !!">
        <div>
          <p>Chúng tôi đã gửi một email tới <b>{userDto.email}</b></p>
            <p>Vui lòng kiểm tra email để xác thực tài khoản
            </p>
          </div>
        </CustomModal> */}
      </Container>
    </>
  );
}
