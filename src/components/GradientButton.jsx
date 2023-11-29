import { styled } from "@mui/material/styles";
import MuiButton from "@mui/material/Button";

export const GradientButton = styled(MuiButton)((props) => ({
    background: props.disabled ? "none" : "linear-gradient(to right, #00838f ,#3d8c62)",
}));
