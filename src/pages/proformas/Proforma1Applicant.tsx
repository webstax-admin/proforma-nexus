import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppState } from "@/store/app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { recordEvent } from "@/lib/analytics";

const Proforma1Applicant = () => {
  const { id } = useParams();
  const { state, saveProforma1, submitProforma1 } = useAppState();
  const applicant = id ? state.applicants[id] : undefined;
  const [proforma, setProforma] = useState(applicant?.proforma1 ?? "");

  useEffect(() => {
    setProforma(applicant?.proforma1 ?? "");
  }, [applicant?.proforma1]);

  if (!applicant) return <main className="p-6">Applicant not found.</main>;

  const onSave = () => {
    saveProforma1(applicant.id, proforma);
    recordEvent({ type: "proforma1_saved", actorRole: "applicant", applicantId: applicant.id });
    toast.success("Proforma 1 saved");
  };

  const onSubmit = () => {
    if (!proforma.trim()) return toast.error("Please fill Proforma 1 before submitting");
    submitProforma1(applicant.id);
    recordEvent({ type: "proforma1_submitted", actorRole: "applicant", applicantId: applicant.id });
    toast.success("Submitted for admin approval");
  };

  const submitted = applicant.submitted;

  return (
    <main className="min-h-screen p-6">
      <Helmet>
        <title>Proforma 1 | Applicant</title>
        <meta name="description" content="Fill and submit Proforma 1." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/applicant/:id/proforma-1"} />
      </Helmet>
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-semibold">Proforma 1 - {applicant.name}</h1>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Proforma 1</CardTitle>
            <CardDescription>Applicant placeholder form.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pf1">Content</Label>
              <Textarea id="pf1" rows={12} value={proforma} onChange={(e) => setProforma(e.target.value)} disabled={submitted} placeholder="Enter Proforma 1 details here..." />
            </div>
            {!submitted ? (
              <div className="flex gap-3">
                <Button onClick={onSave}>Save</Button>
                <Button onClick={onSubmit} variant="secondary">Submit</Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Submitted. Waiting for admin approval.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Proforma1Applicant;
