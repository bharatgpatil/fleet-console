import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { ButtonLabel, DrawerBody, DrawerScroll } from './NeedsYouButton.styles.ts';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { useState } from 'react';
import { NeedsYouQueue } from './NeedsYouQueue.tsx';
import { useNeedsYou } from '../hooks/use-needs-you.ts';

export function NeedsYouButton() {
  const [open, setOpen] = useState(false);
  const alerts = useNeedsYou();
  const hasCritical = alerts[0]?.severity === 'critical';

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<NotificationsIcon sx={{ color: hasCritical ? 'error.main' : 'inherit' }} />}
        aria-label={`Needs you, ${alerts.length} waiting`}
        sx={{ color: 'text.primary', borderColor: 'divider' }}
      >
        <ButtonLabel>Needs you</ButtonLabel>
        <span className="tabular">{alerts.length}</span>
      </Button>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <DrawerBody spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h2">
                Needs you
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {alerts.length ? `${alerts.length} waiting` : 'Nothing waiting'}
              </Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)} aria-label="Close">
              <CloseIcon />
            </IconButton>
          </Stack>
          <DrawerScroll>
            <NeedsYouQueue alerts={alerts} onOpenRobot={() => setOpen(false)} />
          </DrawerScroll>
        </DrawerBody>
      </Drawer>
    </>
  );
}
