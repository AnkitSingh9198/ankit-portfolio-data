/**
 * Prefix for files in /public. Empty in normal builds (absolute "/images/..."),
 * "." for the portable preview build so it works from any sub-path.
 */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_ASSET_BASE ?? ""}${path}`;
