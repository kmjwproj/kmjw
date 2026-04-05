'use client';

import { useRef, useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const supabase = createClient();

const INTERESTS = [
  '스포츠',
  '여행',
  '음악',
  '독서',
  '게임',
  '요리',
  '영화',
  '사진',
];
const GENDERS = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
  { value: 'other', label: '기타' },
];
const AGE_RANGES = [
  { value: '10s', label: '10대' },
  { value: '20s', label: '20대' },
  { value: '30s', label: '30대' },
  { value: '40s+', label: '40대 이상' },
];

type Profile = {
  id: string;
  user_id: string;
  nickname: string;
  profile_image: string | null;
  gender: string | null;
  age_range: string | null;
  bio: string | null;
  interests: string[] | null;
};

const fetchProfile = async (): Promise<Profile> => {
  const res = await fetch('/api/profile');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json();
};

const updateProfile = async (body: Partial<Profile>): Promise<Profile> => {
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

const uploadAvatar = async (file: File): Promise<string> => {
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

const getImageUrl = (path: string | null) => {
  if (!path) return null;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
};

export const MyScreen = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [profileImagePath, setProfileImagePath] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (path) => setProfileImagePath(path),
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      setEditing(false);
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const startEdit = () => {
    if (!profile) return;
    setNickname(profile.nickname || '');
    setGender(profile.gender || '');
    setAgeRange(profile.age_range || '');
    setBio(profile.bio || '');
    setInterests(profile.interests || []);
    setProfileImagePath(profile.profile_image || null);
    setPreview(getImageUrl(profile.profile_image));
    setEditing(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    avatarMutation.mutate(file);
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleSave = () => {
    updateMutation.mutate({
      nickname,
      gender: gender || null,
      age_range: ageRange || null,
      bio: bio || null,
      interests: interests.length > 0 ? interests : null,
      profile_image: profileImagePath || null,
    });
  };

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">프로필을 찾을 수 없습니다.</p>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="bg-background flex min-h-screen flex-col items-center p-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold">프로필 수정</h1>
            <p className="text-muted-foreground">내 정보를 수정하세요.</p>
          </div>

          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold">프로필 사진</h2>
            <button
              type="button"
              className="bg-muted mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl">📷</span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="text-muted-foreground mt-2 text-center text-sm">
              {avatarMutation.isPending ? '업로드 중...' : '탭하여 사진 변경'}
            </p>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">닉네임</h2>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="닉네임"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">자기소개</h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력해주세요"
              className="h-24 w-full resize-none rounded-lg border p-3"
            />
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">성별</h2>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="">성별 선택</option>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">연령대</h2>
            <select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className="w-full rounded-lg border p-3"
            >
              <option value="">연령대 선택</option>
              {AGE_RANGES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h2 className="mb-2 text-lg font-semibold">관심사</h2>
            <div className="grid grid-cols-2 gap-2">
              {INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className="flex cursor-pointer items-center rounded border p-2"
                >
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          {updateMutation.isError && (
            <p className="text-destructive mb-3 text-sm">
              저장 실패: {updateMutation.error?.message}
            </p>
          )}

          <button
            className="bg-primary text-primary-foreground mb-2 w-full rounded-lg p-3 disabled:opacity-50"
            onClick={handleSave}
            disabled={
              updateMutation.isPending ||
              avatarMutation.isPending ||
              !nickname.trim()
            }
          >
            {updateMutation.isPending ? '저장 중...' : '저장'}
          </button>
          <button
            className="w-full rounded-lg border p-3"
            onClick={() => setEditing(false)}
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(profile.profile_image);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center p-8 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">마이페이지</h1>
          <p className="text-muted-foreground">내 프로필 정보</p>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="bg-muted flex h-24 w-24 items-center justify-center overflow-hidden rounded-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground mb-1 text-sm">닉네임</p>
            <p className="font-semibold">{profile.nickname}</p>
          </div>
          {profile.bio && (
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground mb-1 text-sm">자기소개</p>
              <p>{profile.bio}</p>
            </div>
          )}
          {profile.gender && (
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground mb-1 text-sm">성별</p>
              <p>
                {GENDERS.find((g) => g.value === profile.gender)?.label ??
                  profile.gender}
              </p>
            </div>
          )}
          {profile.age_range && (
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground mb-1 text-sm">연령대</p>
              <p>
                {AGE_RANGES.find((a) => a.value === profile.age_range)?.label ??
                  profile.age_range}
              </p>
            </div>
          )}
          {profile.interests && profile.interests.length > 0 && (
            <div className="rounded-lg border p-4">
              <p className="text-muted-foreground mb-2 text-sm">관심사</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <span
                    key={i}
                    className="bg-muted rounded-full px-3 py-1 text-sm"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="bg-primary text-primary-foreground w-full rounded-lg p-3"
            onClick={startEdit}
          >
            프로필 수정
          </button>

          <button
            className="border-destructive text-destructive hover:bg-destructive/10 w-full rounded-lg border p-3"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};
