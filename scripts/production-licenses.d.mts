import type { Plugin } from "vite";
export const productionLicenses: Record<string, string[]>;
export function dependencyLicenseText(root: string): string;
export function productionLicenseAsset(): Plugin;
