import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAppState } from "@/store/app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { recordEvent } from "@/lib/analytics";

const Proforma2Company = () => {
  const { id } = useParams();
  const { state, saveProforma2 } = useAppState();
  const company = id ? state.companies[id] : undefined;
  const [proforma, setProforma] = useState(company?.proforma2 ?? "");

  if (!company) return <main className="p-6">Company not found.</main>;

  const onSaveProforma = () => {
    saveProforma2(company.id, proforma);
    recordEvent({ type: "proforma2_saved", actorRole: "company", companyId: company.id });
    toast.success("Proforma 2 saved");
  };

  return (
    <main className="min-h-screen p-6">
      <Helmet>
        <title>Proforma 2 | Company</title>
        <meta name="description" content="Edit and save Proforma 2." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/company/:id/proforma-2"} />
      </Helmet>
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-semibold">Proforma 2 - {company.name}</h1>

        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Proforma 2</CardTitle>
            <CardDescription>Company placeholder form.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pf2">Content</Label>
              <Textarea id="pf2" rows={12} value={proforma} onChange={(e) => setProforma(e.target.value)} placeholder="Enter Proforma 2 details here..." />
            </div>
            <Button onClick={onSaveProforma}>Save Proforma 2</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Proforma2Company;
