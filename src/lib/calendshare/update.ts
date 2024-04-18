import type { RecordEntryWithRelations, RecordsWithRelations } from "$lib/drizzle/schema"

const update = {
	record: async (record: RecordsWithRelations) => {
		const res = await fetch("/api/calendshare/record", {
			method: "POST",
			body: JSON.stringify(record)
		})

		return res.ok
	}
}

export default update
