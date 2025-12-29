declare module "diacritics-map" {
	const diacritics: Record<string, string>;
	export default diacritics;
}

declare module "strip-color" {
	function stripColor(str: string): string;
	export default stripColor;
}
