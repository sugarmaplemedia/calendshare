export function getSelectorDays(
	days: "all" | "weekdays" | "weekends" | Array<string>
): Array<string> {
	switch (days) {
		case "all":
			return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
		case "weekdays":
			return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
		case "weekends":
			return ["Saturday", "Sunday"]
		default:
			return days
	}
}

export function getSelectorHours(
	hours: "all" | "morning" | "business" | "afternoon" | Array<string>
): Array<string> {
	switch (hours) {
		case "all":
			return Array.from(Array(24).keys()).map((hour) => `${hour < 10 ? "0" + hour : hour}:00`)
		case "business":
			return Array.from(Array(10).keys()).map(
				(hour) => `${hour + 8 < 10 ? "0" + (hour + 8) : hour + 8}:00`
			)
		case "morning":
			return Array.from(Array(12).keys()).map((hour) => `${hour < 10 ? "0" + hour : hour}:00`)
		case "afternoon":
			return Array.from(Array(12).keys()).map(
				(hour) => `${hour + 12 < 10 ? "0" + (hour + 12) : hour + 12}:00`
			)
		default:
			return hours
	}
}
