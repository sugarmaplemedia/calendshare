export type DayWeekSelectorOptions = {
	days: "all" | "weekdays" | "weekends" | Array<string>
	times: "all" | "business" | Array<string>
	increment: "hour" | "half-hour" | "quarter-hour"
}
