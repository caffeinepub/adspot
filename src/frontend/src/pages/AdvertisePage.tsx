import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitInquiry } from "../hooks/useQueries";

export default function AdvertisePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutateAsync, isPending } = useSubmitInquiry();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Invalid email";
    if (!company.trim()) e.company = "Company name is required";
    if (!message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await mutateAsync({ name, email, company, message });
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-5"
          >
            Advertise on <span className="text-primary">AdSpot</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Connect with thousands of engaged visitors. Fill out the form below
            and our team will reach out within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: "50,000+ Monthly Impressions",
              desc: "Reach a large, engaged audience every month",
            },
            {
              title: "Targeted Placement",
              desc: "Your ads appear in the right categories",
            },
            {
              title: "Flexible Packages",
              desc: "Plans for every budget and goal",
            },
          ].map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card/50 p-5 text-center"
            >
              <h3 className="font-semibold text-sm text-primary mb-2">
                {benefit.title}
              </h3>
              <p className="text-xs text-muted-foreground">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card p-8"
        >
          {submitted ? (
            <div
              className="text-center py-8"
              data-ocid="advertise.success_state"
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Request Submitted!</h2>
              <p className="text-muted-foreground">
                Thank you, <strong className="text-foreground">{name}</strong>!
                We'll be in touch within 24 hours to discuss advertising
                opportunities.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              data-ocid="advertise.form"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Contact Us</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us about your advertising needs
                </p>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Full Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="bg-muted border-border"
                  data-ocid="advertise.name.input"
                />
                {errors.name && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="advertise.name.error_state"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="bg-muted border-border"
                  data-ocid="advertise.email.input"
                />
                {errors.email && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="advertise.email.error_state"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" /> Company Name
                </Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corp"
                  className="bg-muted border-border"
                  data-ocid="advertise.company.input"
                />
                {errors.company && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="advertise.company.error_state"
                  >
                    {errors.company}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message" className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your advertising goals, target audience, and budget..."
                  className="bg-muted border-border resize-none"
                  rows={5}
                  data-ocid="advertise.message.textarea"
                />
                {errors.message && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="advertise.message.error_state"
                  >
                    {errors.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-primary text-primary-foreground font-semibold py-3 hover:opacity-90 transition-opacity"
                data-ocid="advertise.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Request"
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </section>
    </div>
  );
}
