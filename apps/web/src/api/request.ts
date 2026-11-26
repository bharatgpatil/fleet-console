import { ApiError } from '@fleet/contracts';
import type { z } from 'zod';

export async function request<Schema extends z.ZodType>({
  path,
  schema,
  init,
}: {
  path: string;
  schema: Schema;
  init?: RequestInit;
}): Promise<z.infer<Schema>> {
  const response = await fetch(path, init);
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const parsed = ApiError.safeParse(body);

    throw new Error(parsed.success ? parsed.data.error : `HTTP ${response.status}`);
  }

  return schema.parse(body);
}
