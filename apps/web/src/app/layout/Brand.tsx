import HubIcon from '@mui/icons-material/HubOutlined';
import { Stack, Typography } from '@mui/material';
import { TextLink } from '../../shared/components/TextLink.tsx';
import { BrandMark, BrandName } from './Brand.styles.ts';

export function Brand() {
  return (
    <TextLink to="/fleet" underline="none" color="inherit" aria-label="Fleet Console home">
      <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
        <BrandMark aria-hidden>
          <HubIcon sx={{ fontSize: 18 }} />
        </BrandMark>
        <Typography variant="subtitle2" component={BrandName}>
          Fleet Console
        </Typography>
      </Stack>
    </TextLink>
  );
}
