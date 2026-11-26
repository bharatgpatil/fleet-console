import { ButtonLink } from '../shared/components/ButtonLink.tsx';
import { EmptyState } from '../shared/components/EmptyState.tsx';

export function NotFound() {
  return (
    <EmptyState title="Page not found">
      <ButtonLink to="/fleet">Back to fleet</ButtonLink>
    </EmptyState>
  );
}
