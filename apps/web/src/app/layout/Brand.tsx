import { Typography } from '@mui/material';
import { TextLink } from '../../shared/components/TextLink.tsx';

export function Brand() {
  return (
    <TextLink to="/fleet" underline="none" color="inherit">
      <Typography variant="subtitle2" component="span">
        Fleet Console
      </Typography>
    </TextLink>
  );
}
