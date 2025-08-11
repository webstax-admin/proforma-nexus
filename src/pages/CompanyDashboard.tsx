import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useAppState } from "@/store/app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";
import { recordEvent } from "@/lib/analytics";

const CompanyDashboard = () => {
  const { id } = useParams();
  const { state, saveProforma2, createApplicant, logout } = useAppState();
  const company = id ? state.companies[id] : undefined;
  const [proforma, setProforma] = useState(company?.proforma2 ?? "");
  const [applicantName, setApplicantName] = useState("");

  if (!company) return <main className="p-6">Company not found.</main>;

  const onSaveProforma = () => {
    saveProforma2(company.id, proforma);
    toast.success("Proforma 2 saved");
  };

  const onCreateApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) return;
    const { username, password, applicantId } = createApplicant(company.id, applicantName.trim());
    recordEvent({ type: "applicant_created", actorRole: "company", companyId: company.id, applicantId });
    toast.success(`Applicant created. Credentials: ${username} / ${password}`);
    setApplicantName("");
  };

  const applicants = company.applicants.map((aid) => state.applicants[aid]).filter(Boolean);

  return (
    <main className="min-h-screen p-6">
      <Helmet>
        <title>Company | Proforma 2 & Applicants</title>
        <meta name="description" content="Company portal to manage Proforma 2 and applicants." />
      </Helmet>
      <div className="container mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">{company.name}</h1>
          <Button variant="secondary" onClick={logout}>Log out</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Proforma 2</CardTitle>
              <CardDescription>Open the dedicated Proforma 2 page to edit and save.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild>
                <Link to={`/company/${company.id}/proforma-2`}>Open Proforma 2</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create Applicant</CardTitle>
              <CardDescription>Generate credentials for an applicant.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onCreateApplicant} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="ap-name">Applicant name</Label>
                  <Input id="ap-name" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} placeholder="e.g. John Doe" />
                </div>
                <div className="pt-6 sm:pt-0">
                  <Button type="submit" className="w-full">Create</Button>
                </div>
              </form>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Applicants</h3>
                {applicants.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No applicants yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applicants.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>{a.name}</TableCell>
                          <TableCell>
                            {a.approved ? "Approved" : a.submitted ? "Submitted (Pending)" : "Draft"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default CompanyDashboard;
