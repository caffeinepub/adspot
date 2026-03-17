import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Ad, Inquiry, backendInterface } from "../backend";
import type { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useGetActiveAds() {
  const { actor, isFetching } = useActor();
  return useQuery<Ad[]>({
    queryKey: ["activeAds"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveAds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Ad[]>({
    queryKey: ["adsByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getActiveAds();
      return actor.getAdsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      company: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitInquiry(
        data.name,
        data.email,
        data.company,
        data.message,
      );
    },
  });
}

type CreateAdArgs = Parameters<backendInterface["createAd"]>;
type UpdateAdArgs = Parameters<backendInterface["updateAd"]>;

export function useCreateAd() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateAdArgs) => {
      if (!actor) throw new Error("Not connected");
      return actor.createAd(...data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeAds"] });
      qc.invalidateQueries({ queryKey: ["adsByCategory"] });
    },
  });
}

export function useUpdateAd() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateAdArgs) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateAd(...data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeAds"] });
      qc.invalidateQueries({ queryKey: ["adsByCategory"] });
    },
  });
}

export function useDeleteAd() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (adId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteAd(adId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeAds"] });
      qc.invalidateQueries({ queryKey: ["adsByCategory"] });
    },
  });
}

export function useToggleAdStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (adId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.toggleAdActiveStatus(adId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["activeAds"] });
      qc.invalidateQueries({ queryKey: ["adsByCategory"] });
    },
  });
}

export type { ExternalBlob };
