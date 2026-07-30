import { CustomSelect } from '@/shared/components/CustomSelect';

export function LeaderboardFilter({
  timePeriod,
  setTimePeriod,
  selectedPeriod,
  setSelectedPeriod,
  periodOptions
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
      <div className="flex gap-2">
        <button
          onClick={() => setTimePeriod('weekly')}
          className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer border ${timePeriod === 'weekly'
            ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-sm'
            : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/50'
            }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setTimePeriod('monthly')}
          className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer border ${timePeriod === 'monthly'
            ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-sm'
            : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/50'
            }`}
        >
          Monthly
        </button>
      </div>

      <CustomSelect
        value={selectedPeriod}
        onChange={(val) => setSelectedPeriod(val)}
        options={periodOptions}
        className="min-w-[170px] sm:min-w-[210px]"
      />
    </div>
  );
}
