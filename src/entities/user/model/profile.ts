export type Profile = {
  id: string;
  user_id: string;
  nickname: string;
  profile_image: string | null;
  gender: string | null;
  age_range: string | null;
  bio: string | null;
  interests: string[] | null;
};

export const GENDERS = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
  { value: 'other', label: '기타' },
];

export const AGE_RANGES = [
  { value: '10s', label: '10대' },
  { value: '20s', label: '20대' },
  { value: '30s', label: '30대' },
  { value: '40s+', label: '40대 이상' },
];

export const INTERESTS = [
  '스포츠',
  '여행',
  '음악',
  '독서',
  '게임',
  '요리',
  '영화',
  '사진',
];
