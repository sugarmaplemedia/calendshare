export function hourNumberToString(
	hour: number,
	options: { militaryTime: boolean } | undefined = { militaryTime: true }
) {
	if (options.militaryTime) {
		return hour < 10 ? `0${hour}:00` : `${hour}:00`
	} else {
		return `${hour % 12 == 0 ? 12 : hour % 12}:00 ${hour < 12 ? "A.M." : "P.M."}`
	}
}
