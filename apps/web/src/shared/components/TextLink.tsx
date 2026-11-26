import { Link as MuiLink, type LinkProps } from '@mui/material';
import { createLink } from '@tanstack/react-router';
import type { Ref } from 'react';

export const TextLink = createLink(function TextAnchor(
  props: LinkProps & { ref?: Ref<HTMLAnchorElement> },
) {
  return <MuiLink {...props} />;
});
