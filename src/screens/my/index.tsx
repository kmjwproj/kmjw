'use client';

import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  AGE_RANGES,
  GENDERS,
  fetchProfile,
  getImageUrl,
} from '@/src/entities/user/api/profile';
import { useAuthStore } from '@/src/shared/store/auth-store';

export const MyScreen = () => {
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const goToEdit = () => {
    router.push('/my/profile-edit');
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

  const imageUrl = getImageUrl(profile.profile_image);

  return (
    <div className="bg-background flex min-h-screen flex-col items-center p-8 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">마이페이지</h1>
          <p className="text-muted-foreground">내 프로필 정보</p>
        </div>

        <div className="mb-6 flex justify-center">
          <Avatar className="h-24 w-24 border-2 border-muted">
            <AvatarImage src={imageUrl || undefined} className="object-cover" />
            <AvatarFallback className="text-3xl bg-muted">👤</AvatarFallback>
          </Avatar>
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
          <Button className="w-full h-12 rounded-md" onClick={goToEdit}>
            프로필 수정
          </Button>
          <Button variant="destructive" className="w-full h-12 rounded-md" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>
      </div>
    </div>
  );
};
