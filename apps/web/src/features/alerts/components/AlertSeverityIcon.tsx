import ErrorIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningIcon from '@mui/icons-material/WarningAmber';
import CheckIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import type { Alert } from '@fleet/contracts';

export function AlertSeverityIcon({ alert }: { alert: Alert }) {
  if (alert.resolvedAt !== null) {
    return <CheckIcon fontSize="small" color="success" titleAccess="Resolved" />;
  }

  return alert.severity === 'critical' ? (
    <ErrorIcon fontSize="small" color="error" titleAccess="Critical" />
  ) : (
    <WarningIcon fontSize="small" color="warning" titleAccess="Warning" />
  );
}
