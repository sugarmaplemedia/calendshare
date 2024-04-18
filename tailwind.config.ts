import { join } from "path"
import type { Config } from "tailwindcss"
import forms from "@tailwindcss/forms"
import { skeleton } from "@skeletonlabs/tw-plugin"

export default {
	darkMode: "class",
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		join(require.resolve("@skeletonlabs/skeleton"), "../**/*.{html,js,svelte,ts}")
	],
	theme: {
		extend: {
			colors: {
				tomato: "#D50000",
				tangerine: "#F4511E",
				banana: "#F6BF26",
				basil: "#0B8043",
				sage: "#33B679",
				peacock: "#039BE5",
				blueberry: "#3F51B5",
				lavender: "#7986CB",
				grape: "#8E24AA",
				flamingo: "#E67C73",
				graphite: "#616161",
				tungsten: "#333333"
			}
		}
	},
	plugins: [
		require("tailwindcss-3d"),
		forms,
		skeleton({
			themes: {
				preset: [
					{
						name: "hamlindigo",
						enhancements: true
					}
				]
			}
		})
	]
} satisfies Config
