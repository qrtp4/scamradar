export declare function validateTarget(value: unknown): URL;
export declare function isPublicIPv4(address: string): boolean;
export declare function publicDnsLookup(resolver?: (hostname: string, options: object) => Promise<{address: string; family: number}[]>): (hostname: string, options: any, callback: (err: Error | null, address?: any, family?: number) => void) => void;
