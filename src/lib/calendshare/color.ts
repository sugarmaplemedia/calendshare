export type Palette = {
	name: string
	hex: string
	classes: string
	input: HTMLInputElement | undefined
}[]

export const palette: Palette = [
	// These colors are the Google Calendar event colors.
	{
		name: "Tomato",
		hex: "#D50000",
		classes: "bg-tomato focus-within:outline-tomato",
		input: undefined
	},
	{
		name: "Tangerine",
		hex: "#F4511E",
		classes: "bg-tangerine focus-within:outline-tangerine",
		input: undefined
	},
	{
		name: "Banana",
		hex: "#F6BF26",
		classes: "bg-banana focus-within:outline-banana",
		input: undefined
	},
	{
		name: "Basil",
		hex: "#0B8043",
		classes: "bg-basil focus-within:outline-basil",
		input: undefined
	},
	{
		name: "Sage",
		hex: "#33B679",
		classes: "bg-sage focus-within:outline-sage",
		input: undefined
	},
	{
		name: "Peacock",
		hex: "#039BE5",
		classes: "bg-peacock focus-within:outline-peacock",
		input: undefined
	},
	{
		name: "Blueberry",
		hex: "#3F51B5",
		classes: "bg-blueberry focus-within:outline-blueberry",
		input: undefined
	},
	{
		name: "Lavender",
		hex: "#7986CB",
		classes: "bg-lavender focus-within:outline-lavender",
		input: undefined
	},
	{
		name: "Grape",
		hex: "#8E24AA",
		classes: "bg-grape focus-within:outline-grape",
		input: undefined
	},
	{
		name: "Flamingo",
		hex: "#E67C73",
		classes: "bg-flamingo focus-within:outline-flamingo",
		input: undefined
	},
	{
		name: "Graphite",
		hex: "#616161",
		classes: "bg-graphite focus-within:outline-graphite",
		input: undefined
	},
	{
		name: "Tungsten",
		hex: "#333333",
		classes: "bg-tungsten focus-within:outline-tungsten",
		input: undefined
	}
]

export function getRandomColorFromPalette() {
	return palette[Math.floor(Math.random() * palette.length)]
}
