import { Component, type ReactNode } from 'react';
import { AppCrash } from './AppCrash.tsx';

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  failed: boolean;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  override state: AppErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { failed: true };
  }

  override render() {
    return this.state.failed ? <AppCrash /> : this.props.children;
  }
}
