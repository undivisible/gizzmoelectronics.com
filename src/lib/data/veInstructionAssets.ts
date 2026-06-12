export type VeInstructionAsset = {
	name: string;
	group: string;
	kind: string;
	url: string;
	relativePath: string;
};

export const veAssetBase = '/ve/';
export const veSymbolBase = `${veAssetBase}SWC-Symbol-RedNEW/`;

export const veInstructionAssets: VeInstructionAsset[] = [
	{
		name: 'VE cosmetic design',
		group: 'Product render',
		kind: 'JPG',
		url: `${veAssetBase}VE-Cosmetic%20design.1263.jpg`,
		relativePath: 'VE-Cosmetic design.1263.jpg',
	},
	{
		name: 'User installation manual',
		group: 'Manual',
		kind: 'PDF',
		url: `${veAssetBase}FP9355_User_Installation_Manual_A5-24072023.pdf`,
		relativePath: 'FP9355_User_Installation_Manual_A5-24072023.pdf',
	},
	{
		name: 'Active dial',
		group: 'Dial states',
		kind: 'BMP',
		url: `${veSymbolBase}StartwithRicons.bmp`,
		relativePath: 'SWC-Symbol-RedNEW/StartwithRicons.bmp',
	},
	{
		name: 'Idle dial',
		group: 'Dial states',
		kind: 'BMP',
		url: `${veSymbolBase}StartwithGicons.bmp`,
		relativePath: 'SWC-Symbol-RedNEW/StartwithGicons.bmp',
	},
	{
		name: 'Fan',
		group: 'Climate icons',
		kind: 'BMP',
		url: `${veSymbolBase}Fan_Segments/formatted/10.bmp`,
		relativePath: 'SWC-Symbol-RedNEW/Fan_Segments/formatted/10.bmp',
	},
	{
		name: 'Air conditioning',
		group: 'Climate icons',
		kind: 'BMP',
		url: `${veSymbolBase}AC-SymbolsNEW.bmp`,
		relativePath: 'SWC-Symbol-RedNEW/AC-SymbolsNEW.bmp',
	},
	{
		name: 'Air conditioning off',
		group: 'Climate icons',
		kind: 'BMP',
		url: `${veSymbolBase}AC-OFF-SymbolsNEW.bmp`,
		relativePath: 'SWC-Symbol-RedNEW/AC-OFF-SymbolsNEW.bmp',
	},
	{
		name: 'Fresh air',
		group: 'Climate icons',
		kind: 'BMP',
		url: `${veSymbolBase}FreshSymbolRed.bmp`,
		relativePath: 'SWC-Symbol-RedNEW/FreshSymbolRed.bmp',
	},
	{
		name: 'Steering wheel control',
		group: 'Input icons',
		kind: 'BMP',
		url: `${veSymbolBase}SWC-Symbol-RedNEW.BMP`,
		relativePath: 'SWC-Symbol-RedNEW/SWC-Symbol-RedNEW.BMP',
	},
	{
		name: 'Power red',
		group: 'Input icons',
		kind: 'BMP',
		url: `${veSymbolBase}ON-OFF-Symbol-Red.BMP`,
		relativePath: 'SWC-Symbol-RedNEW/ON-OFF-Symbol-Red.BMP',
	},
	{
		name: 'Power grey',
		group: 'Input icons',
		kind: 'BMP',
		url: `${veSymbolBase}ON-OFF-Symbol-GreyNEW.BMP`,
		relativePath: 'SWC-Symbol-RedNEW/ON-OFF-Symbol-GreyNEW.BMP',
	},
];

export const veInstructionGroups = [
	...new Set(veInstructionAssets.map((asset) => asset.group)),
];
