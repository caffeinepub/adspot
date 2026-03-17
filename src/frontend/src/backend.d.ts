import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Ad {
    id: bigint;
    title: string;
    externalLink: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    category: string;
    imageId: ExternalBlob;
}
export interface Inquiry {
    id: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    company: string;
    message: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAd(title: string, description: string, imageId: ExternalBlob, externalLink: string, category: string): Promise<bigint>;
    deleteAd(adId: bigint): Promise<void>;
    getActiveAds(): Promise<Array<Ad>>;
    getAdById(adId: bigint): Promise<Ad | null>;
    getAdsByCategory(category: string): Promise<Array<Ad>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInquiry(name: string, email: string, company: string, message: string): Promise<void>;
    toggleAdActiveStatus(adId: bigint): Promise<void>;
    updateAd(adId: bigint, title: string, description: string, imageId: ExternalBlob, externalLink: string, category: string): Promise<void>;
}
