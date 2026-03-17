import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  LogIn,
  Pencil,
  Plus,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Ad, ExternalBlob } from "../backend";
import AdminAdForm from "../components/AdminAdForm";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateAd,
  useDeleteAd,
  useGetActiveAds,
  useGetAllInquiries,
  useIsAdmin,
  useToggleAdStatus,
  useUpdateAd,
} from "../hooks/useQueries";
import { getCategoryBadgeClass } from "../lib/categoryColors";

const ADS_SKELETON_KEYS = ["ads-sk-1", "ads-sk-2", "ads-sk-3"];
const INQ_SKELETON_KEYS = ["inq-sk-1", "inq-sk-2", "inq-sk-3"];

export default function AdminPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const { data: isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { data: ads, isLoading: adsLoading } = useGetActiveAds();
  const { data: inquiries, isLoading: inquiriesLoading } = useGetAllInquiries();

  const createAd = useCreateAd();
  const updateAd = useUpdateAd();
  const deleteAd = useDeleteAd();
  const toggleStatus = useToggleAdStatus();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  const handleFormSubmit = async (data: {
    title: string;
    description: string;
    imageId: ExternalBlob;
    externalLink: string;
    category: string;
  }) => {
    try {
      if (editingAd) {
        await updateAd.mutateAsync([
          editingAd.id,
          data.title,
          data.description,
          data.imageId,
          data.externalLink,
          data.category,
        ]);
        toast.success("Ad updated successfully");
      } else {
        await createAd.mutateAsync([
          data.title,
          data.description,
          data.imageId,
          data.externalLink,
          data.category,
        ]);
        toast.success("Ad created successfully");
      }
      setFormOpen(false);
      setEditingAd(null);
    } catch {
      toast.error("Failed to save ad. Please try again.");
    }
  };

  const handleDelete = async (adId: bigint) => {
    try {
      await deleteAd.mutateAsync(adId);
      toast.success("Ad deleted");
    } catch {
      toast.error("Failed to delete ad");
    }
  };

  const handleToggle = async (adId: bigint) => {
    try {
      await toggleStatus.mutateAsync(adId);
      queryClient.invalidateQueries({ queryKey: ["activeAds"] });
      toast.success("Ad status updated");
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">
            Please log in with your admin account to access the management
            panel.
          </p>
          <Button
            type="button"
            onClick={() => login()}
            disabled={isLoggingIn}
            className="rounded-full bg-primary text-primary-foreground px-8"
            data-ocid="admin.login.button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2
          className="w-8 h-8 animate-spin text-primary"
          data-ocid="admin.loading_state"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/20 border border-destructive/30 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-7 h-7 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have admin privileges to access this panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-1">
            Manage ads and view advertiser inquiries
          </p>
        </motion.div>

        <Tabs defaultValue="ads" className="space-y-6">
          <TabsList
            className="bg-card border border-border rounded-xl p-1"
            data-ocid="admin.tabs.tab"
          >
            <TabsTrigger
              value="ads"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="admin.ads.tab"
            >
              Manage Ads
              {ads && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {ads.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="inquiries"
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="admin.inquiries.tab"
            >
              Inquiries
              {inquiries && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {inquiries.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Ads Tab */}
          <TabsContent value="ads" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Active Ads</h2>
              <Button
                type="button"
                onClick={() => {
                  setEditingAd(null);
                  setFormOpen(true);
                }}
                className="rounded-full bg-primary text-primary-foreground gap-2"
                data-ocid="admin.new_ad.button"
              >
                <Plus className="w-4 h-4" /> New Ad
              </Button>
            </div>

            {adsLoading ? (
              <div className="space-y-3" data-ocid="admin.ads.loading_state">
                {ADS_SKELETON_KEYS.map((key) => (
                  <Skeleton key={key} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            ) : !ads || ads.length === 0 ? (
              <div
                className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/30"
                data-ocid="admin.ads.empty_state"
              >
                <p className="text-muted-foreground mb-4">
                  No ads yet. Create your first ad!
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    setEditingAd(null);
                    setFormOpen(true);
                  }}
                  variant="outline"
                  className="rounded-full border-primary text-primary hover:bg-primary/10"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Ad
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {ads.map((ad, i) => (
                  <motion.div
                    key={ad.id.toString()}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-border/80 transition-colors"
                    data-ocid={`admin.ads.item.${i + 1}`}
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <img
                        src={ad.imageId.getDirectURL()}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{ad.title}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getCategoryBadgeClass(ad.category)}`}
                        >
                          {ad.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {ad.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      <Badge
                        variant={ad.isActive ? "default" : "secondary"}
                        className={
                          ad.isActive
                            ? "bg-primary/20 text-primary border-primary/30"
                            : ""
                        }
                      >
                        {ad.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 rounded-lg text-muted-foreground hover:text-primary"
                        onClick={() => handleToggle(ad.id)}
                        title={ad.isActive ? "Deactivate" : "Activate"}
                        data-ocid={`admin.ads.toggle.${i + 1}`}
                      >
                        {ad.isActive ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </Button>

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setEditingAd(ad);
                          setFormOpen(true);
                        }}
                        data-ocid={`admin.ads.edit_button.${i + 1}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive"
                            data-ocid={`admin.ads.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent
                          className="bg-card border-border"
                          data-ocid="admin.delete.dialog"
                        >
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Ad?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{ad.title}". This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              className="rounded-full border-border"
                              data-ocid="admin.delete.cancel_button"
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(ad.id)}
                              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              data-ocid="admin.delete.confirm_button"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-4">
            <h2 className="text-lg font-semibold">Advertiser Inquiries</h2>

            {inquiriesLoading ? (
              <div
                className="space-y-3"
                data-ocid="admin.inquiries.loading_state"
              >
                {INQ_SKELETON_KEYS.map((key) => (
                  <Skeleton key={key} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : !inquiries || inquiries.length === 0 ? (
              <div
                className="text-center py-16 rounded-2xl border border-dashed border-border bg-card/30"
                data-ocid="admin.inquiries.empty_state"
              >
                <p className="text-muted-foreground">
                  No inquiries received yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inquiry, i) => (
                  <motion.div
                    key={inquiry.id.toString()}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-xl border border-border bg-card"
                    data-ocid={`admin.inquiries.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold">{inquiry.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {inquiry.email} · {inquiry.company}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {new Date(
                          Number(inquiry.createdAt) / 1_000_000,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {inquiry.message}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AdminAdForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingAd(null);
        }}
        onSubmit={handleFormSubmit}
        editAd={editingAd}
        isPending={createAd.isPending || updateAd.isPending}
      />
    </div>
  );
}
