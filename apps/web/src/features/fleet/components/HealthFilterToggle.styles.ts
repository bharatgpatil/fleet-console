import { ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FilterOption = styled(ToggleButton)(({ theme }) => ({
  padding: theme.spacing(0.25, 1.25),
  gap: theme.spacing(0.75),
}));
