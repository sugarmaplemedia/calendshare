export function clickOrDrag(node: HTMLButtonElement, callback: () => void) {
	const callbackOnMouseEnter = ({ buttons }: MouseEvent) => buttons == 1 && callback()

	node.addEventListener("mousedown", callback)
	node.addEventListener("mouseenter", callbackOnMouseEnter)
	node.addEventListener("touchstart", callback)

	return {
		destroy() {
			node.removeEventListener("mousedown", callback)
			node.removeEventListener("mouseenter", callbackOnMouseEnter)
			node.removeEventListener("touchstart", callback)
		}
	}
}
