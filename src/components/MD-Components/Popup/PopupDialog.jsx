import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";

function PopupDialog({ onClose, children }) {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md" // Adjust dialog width
      fullWidth // Make it take full width
      PaperProps={{
        sx: {
          backgroundColor: "#f5f5f5", // Light gray background
          color: "#333", // Dark text color
          borderRadius: "12px", // Rounded corners
          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)", // Soft shadow effect
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#0080A7", // Dark blue header
          color: "#fff",
          fontSize: "1.2rem",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
        }}
      >
        Entry Form
        
      </DialogTitle>

      <DialogContent sx={{ padding: "20px 24px" }}>{children}</DialogContent>

      <DialogActions
        sx={{
          padding: "12px 24px",
          display: "flex",
          justifyContent: "flex-end",
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #ddd",
        }}
      >
        <Button onClick={onClose} variant="contained" color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Prop types validation
PopupDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default PopupDialog;
