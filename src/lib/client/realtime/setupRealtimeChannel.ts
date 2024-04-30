import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js"
import { onDestroy } from "svelte"

type Payload<Schema, DatabaseObject, DatabaseObjectId> = {
	commit_timestamp: string
	eventType: "INSERT" | "UPDATE" | "DELETE"
	new: DatabaseObject
	old: { id: DatabaseObjectId }
	schema: Schema
	table: string
}

type setupRealtimeChannelOptions<Schema, DatabaseObject, DatabaseObjectId> = {
	filter?: string
	updateHandler?: (payload: Payload<Schema, DatabaseObject, DatabaseObjectId>) => void
	insertHandler?: (payload: Payload<Schema, DatabaseObject, DatabaseObjectId>) => void
	removeHandler?: (payload: Payload<Schema, DatabaseObject, DatabaseObjectId>) => void
}

export type SetupRealtimeChannel = typeof setupRealtimeChannel

function setupRealtimeChannel<DatabaseObject, DatabaseObjectId>(
	supabase: SupabaseClient,
	table: string,
	calendshareId: string,
	options: setupRealtimeChannelOptions<"public", DatabaseObject, DatabaseObjectId>
) {
	supabase
		.channel(`calendshare-${calendshareId}-${table}`)
		.on(
			//@ts-ignore
			"postgres_changes",
			{
				event: "INSERT",
				schema: "public",
				table,
				filter: options.filter
			},
			options.insertHandler
		)
		.on(
			//@ts-ignore
			"postgres_changes",
			{
				event: "UPDATE",
				schema: "public",
				table,
				filter: options.filter
			},
			options.updateHandler
		)
		.on(
			//@ts-ignore
			"postgres_changes",
			{
				event: "DELETE",
				schema: "public",
				table,
				filter: options.filter
			},
			options.removeHandler
		)
		.subscribe()
}

export default setupRealtimeChannel
