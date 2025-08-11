import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useAppState } from "@/store/app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ApplicantDashboard = () => {
  const { id } = useParams();
  const { state, saveProforma1, submitProforma1, logout } = useAppState();
  const applicant = id ? state.applicants[id] : undefined;
  const [proforma, setProforma] = useState(applicant?.proforma1 ?? "");

  useEffect(() => {
    setProforma(applicant?.proforma1 ?? "");
  }, [applicant?.proforma1]);

  if (!applicant) return <main className="p-6">Applicant not found.</main>;

  const onSave = () => {
    saveProforma1(applicant.id, proforma);
    toast.success("Proforma 1 saved");
  };

  const onSubmit = () => {
    if (!proforma.trim()) {
      toast.error("Please fill Proforma 1 before submitting");
      return;
    }
    submitProforma1(applicant.id);
    toast.success("Submitted for admin approval");
  };

  const submitted = applicant.submitted;
  const approved = applicant.approved;

  return (
    <main className="min-h-screen p-6">
      <Helmet>
        <title>Applicant | Proforma 1</title>
        <meta name="description" content="Applicant portal to fill Proforma 1 and view documents." />
      </Helmet>
      <div className="container mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Applicant: {applicant.name}</h1>
          <Button variant="secondary" onClick={logout}>Log out</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Proforma 1</CardTitle>
            <CardDescription>Placeholder form for applicant.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pf1">Content</Label>
              <Textarea id="pf1" rows={10} value={proforma} onChange={(e) => setProforma(e.target.value)} disabled={submitted} placeholder="Enter Proforma 1 details here..." />
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

        {approved && applicant.documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Document Kit</CardTitle>
              <CardDescription>Your generated documents are ready to view.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to={`/applicant/${applicant.id}/documents`}>View Documents</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default ApplicantDashboard;
