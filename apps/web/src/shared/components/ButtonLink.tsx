import { Button, type ButtonProps } from '@mui/material';
import { createLink } from '@tanstack/react-router';
import type { Ref } from 'react';

export const ButtonLink = createLink(function ButtonAnchor(
  props: ButtonProps<'a'> & { ref?: Ref<HTMLAnchorElement> },
) {
  return <Button component="a" {...props} />;
});
