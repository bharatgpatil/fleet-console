import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import { ButtonLabel, DrawerBody, DrawerScroll } from './ActionNeededButton.styles.ts';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { useState } from 'react';
import { ActionNeededQueue } from './ActionNeededQueue.tsx';
import { useActionNeeded } from '../hooks/use-action-needed.ts';

export function ActionNeededButton() {
  const [open, setOpen] = useState(false);
  const alerts = useActionNeeded();
  const hasCritical = alerts[0]?.severity === 'critical';

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        onClick={() => setOpen(true)}
        startIcon={<NotificationsIcon sx={{ color: hasCritical ? 'error.main' : 'inherit' }} />}
        aria-label={`Action needed, ${alerts.length} waiting`}
        sx={{ color: 'text.primary', borderColor: 'divider' }}
      >
        <ButtonLabel>Action needed</ButtonLabel>
        <span className="tabular">{alerts.length}</span>
      </Button>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <DrawerBody spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h2">
                Action needed
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
            <ActionNeededQueue alerts={alerts} onOpenRobot={() => setOpen(false)} />
          </DrawerScroll>
        </DrawerBody>
      </Drawer>
    </>
  );
}
