type Props = {
  dateLabel: string
}

export function DateSeparator({ dateLabel }: Props) {
  return (
    <div className="flex justify-center my-2">
      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
        {dateLabel}
      </span>
    </div>
  )
}
