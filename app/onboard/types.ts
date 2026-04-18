export type OnboardFunnel = {
  Nickname: { nickname?: string }
  Photo: { nickname: string; profile_image?: string }
  BasicInfo: {
    nickname: string
    profile_image: string
    gender?: string
    age_range?: string
    bio?: string
  }
  Interests: {
    nickname: string
    profile_image: string
    gender: string
    age_range: string
    interests: string[]
  }
  Complete: {
    nickname: string
    profile_image: string
    gender: string
    age_range: string
    interests: string[]
    onboarded: true
  }
}

export type StepProps<TStepKey extends keyof OnboardFunnel> = {
  context: OnboardFunnel[TStepKey]
  history: any
}
