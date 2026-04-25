'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  AGE_RANGES,
  GENDERS,
  INTERESTS,
  type Profile,
  fetchProfile,
  getImageUrl,
  updateProfile,
  uploadAvatar,
} from '@/src/entities/user/api/profile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const ProfileEditScreen = () => {
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

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

  return <ProfileEditForm profile={profile} />;
};

const ProfileEditForm = ({ profile }: { profile: Profile }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState(profile.nickname || '');
  const [gender, setGender] = useState(profile.gender || '');
  const [ageRange, setAgeRange] = useState(profile.age_range || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [interests, setInterests] = useState<string[]>(profile.interests || []);
  const [profileImagePath, setProfileImagePath] = useState<string | null>(
    profile.profile_image || null,
  );
  const [preview, setPreview] = useState<string | null>(
    getImageUrl(profile.profile_image),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (path) => setProfileImagePath(path),
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      router.push('/my');
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
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

  const handleCancel = () => {
    router.push('/my');
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center p-8 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">프로필 수정</h1>
          <p className="text-muted-foreground">내 정보를 수정하세요.</p>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <Label className="mb-3 w-full text-left text-lg font-semibold">
            프로필 사진
          </Label>
          <div
            className="relative cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Avatar className="border-muted h-24 w-24 border-2">
              <AvatarImage
                src={preview || undefined}
                className="object-cover"
              />
              <AvatarFallback className="bg-muted text-3xl">📷</AvatarFallback>
            </Avatar>
          </div>
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
          <Label className="mb-2 block text-lg font-semibold">닉네임</Label>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
          />
        </div>

        <div className="mb-4">
          <Label className="mb-2 block text-lg font-semibold">자기소개</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="자기소개를 입력해주세요"
            className="h-24 resize-none"
          />
        </div>

        <div className="mb-4">
          <Label className="mb-2 block text-lg font-semibold">성별</Label>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger>
              <SelectValue placeholder="성별 선택" />
            </SelectTrigger>
            <SelectContent>
              {GENDERS.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Label className="mb-2 block text-lg font-semibold">연령대</Label>
          <Select value={ageRange} onValueChange={setAgeRange}>
            <SelectTrigger>
              <SelectValue placeholder="연령대 선택" />
            </SelectTrigger>
            <SelectContent>
              {AGE_RANGES.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <Label className="mb-2 block text-lg font-semibold">관심사</Label>
          <div className="grid grid-cols-2 gap-2">
            {INTERESTS.map((interest) => (
              <div
                key={interest}
                className="flex items-center space-x-2 rounded border p-2"
              >
                <Checkbox
                  id={`interest-${interest}`}
                  checked={interests.includes(interest)}
                  onCheckedChange={() => toggleInterest(interest)}
                />
                <Label
                  htmlFor={`interest-${interest}`}
                  className="cursor-pointer font-normal hover:bg-transparent"
                >
                  {interest}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {updateMutation.isError && (
          <p className="text-destructive mb-3 text-sm">
            저장 실패: {updateMutation.error?.message}
          </p>
        )}

        <Button
          className="mb-2 h-12 w-full rounded-md"
          onClick={handleSave}
          disabled={
            updateMutation.isPending ||
            avatarMutation.isPending ||
            !nickname.trim()
          }
        >
          {updateMutation.isPending ? '저장 중...' : '저장'}
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full rounded-md"
          onClick={handleCancel}
        >
          취소
        </Button>
      </div>
    </div>
  );
};
