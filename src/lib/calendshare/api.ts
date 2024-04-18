import { browser } from "$app/environment"
import { createDrizzleClient } from "$lib/drizzle"
import {
	calendshares,
	records,
	users,
	type CalendshareWithRelations,
	type CalendshareInsertValues,
	type User
} from "$lib/drizzle/schema"
import { checkEnvironmentIsServer } from "$lib/errors"
import { eq } from "drizzle-orm"
import { getRandomColorFromPalette } from "./color"

export class CalendshareClient {
	/**
	 * Create a new calendshare and return its ID.
	 */
	static async create(calendshare: CalendshareInsertValues) {
		const db = await createDrizzleClient()

		const { id } = (
			await db.insert(calendshares).values(calendshare).returning({ id: calendshares.id })
		)[0]

		await db.insert(records).values({
			color: getRandomColorFromPalette().hex,
			userId: calendshare.ownerId,
			calendshareId: id
		})

		return id
	}

	static async get(id: string, findOrFail = false) {
		checkEnvironmentIsServer()

		const db = await createDrizzleClient()

		const calendshare: CalendshareWithRelations | undefined = await db.query.calendshares.findFirst(
			{
				where: eq(calendshares.id, id),
				with: {
					days: true,
					hours: true,
					records: {
						with: {
							entries: {
								with: {
									day: true
								}
							},
							user: true
						}
					}
				}
			}
		)

		if (findOrFail && !calendshare) {
			throw new Error(`Calendshare with ID ${id} not found.`)
		}

		return calendshare
	}
}

export class UserClient {
	/**
	 * Create a new guest user and return its ID.
	 */
	static async createGuest() {
		checkEnvironmentIsServer()

		const db = await createDrizzleClient()

		const { id } = (await db.insert(users).values({ guest: true }).returning({ id: users.id }))[0]

		return id
	}

	static async get(id: string, findOrFail = false) {
		checkEnvironmentIsServer()

		const db = await createDrizzleClient()

		const user = await db.query.users.findFirst({
			where: eq(users.id, id)
		})

		return user
	}

	static getGuestFromLocalStorage() {
		if (browser) {
			// TODO: find less permeable storage method
			const guest: User | undefined = localStorage.getItem("guest")
				? JSON.parse(localStorage.getItem("guest")!)
				: undefined

			return guest
		}
	}
}
