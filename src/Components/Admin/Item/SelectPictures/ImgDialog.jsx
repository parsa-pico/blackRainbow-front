import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class ImgDialog extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Dialog
        fullScreen
        open={!!this.props.img}
        onClose={this.props.onClose}
        TransitionComponent={Transition}
      >
        <div>
          <AppBar>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.props.onClose}
                aria-label="Close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="title" color="inherit">
                Cropped image
              </Typography>
            </Toolbar>
          </AppBar>
          <div>
            <img src={this.props.img} alt="Cropped" />
          </div>
        </div>
      </Dialog>
    );
  }
}

// export default withStyles(styles)(ImgDialog);
export default ImgDialog;
