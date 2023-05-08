import BasicTable from '@app/components/table';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Link,
  DialogTitle,
} from '@mui/material';
import PropTypes from 'prop-types';
const CustomModal = ({
  isOpen, 
  handleClose,
  title,
}) => {
  return(
      <>
      <Dialog fullWidth maxWidth='md' open={isOpen} onClose={handleClose} aria-labelledby='max-width-dialog-title'>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
              <DialogContentText></DialogContentText>
              <BasicTable/>
              <p style={{textAlign:'center', marginTop:30}}>
                <strong>Bạn vẫn còn có những mắc thắc và băn khoăn cần được giải đáp?</strong>
                <br/>
                Hãy liên hệ ngay với bộ phận Bán hàng online của chúng tôi
                <br/>
                <a href='https://zalo.me/0366754936' target="_blank">0366754936</a>
              </p>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} color = 'primary'>
                  Đóng
              </Button>
          </DialogActions>
          </Dialog>
      </>
  )
}

CustomModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
}

export default CustomModal;