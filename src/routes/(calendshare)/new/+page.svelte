<script lang="ts">
	import { goto } from "$app/navigation"
	import type { User } from "$lib/drizzle/schema"
	import { getModalStore } from "@skeletonlabs/skeleton"

	const modalStore = getModalStore()

	modalStore.trigger({
		type: "component",
		component: "guestLogin",
		meta: {
			closeRedirect: "/"
		},
		response: ({ guest }: { guest: User }) => {
			if (guest) {
				goto(`/new?guestId=${guest.id}`, { invalidateAll: true })
			} else {
				goto("/")
			}
		}
	})
</script>
