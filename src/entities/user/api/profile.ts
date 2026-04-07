import { createClient } from '@/lib/supabase/client';

import type { Profile } from '@/src/entities/user/model/profile';

export type { Profile } from '@/src/entities/user/model/profile';
export { AGE_RANGES, GENDERS, INTERESTS } from '@/src/entities/user/model/profile';

const supabase = createClient();

export const getImageUrl = (path: string | null) => {
  if (!path) return null;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
};

export const fetchProfile = async (): Promise<Profile> => {
  const res = await fetch('/api/profile');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
};

export const updateProfile = async (
  body: Partial<Profile>,
): Promise<Profile> => {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
};

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/profile/avatar', {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  const { path } = await res.json();
  return path;
};
