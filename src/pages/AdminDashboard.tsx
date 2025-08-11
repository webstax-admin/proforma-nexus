import { Helmet } from "react-helmet-async";
import { useAppState } from "@/store/app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";

const docOptions = [
  "Proforma 3",
  "Proforma 4",
  "Proforma 5",
  "Proforma 6",
  "Invitation Letter",
  "Undertaking",
];

const AdminDashboard = () => {
  const { createCompany, getAllCredentials, state, approveApplicant, setDocumentKit, logout } = useAppState();
  const [companyName, setCompanyName] = useState("");
  const [selection, setSelection] = useState<Record<string, boolean>>({});

  const onCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    const { username, password } = createCompany(companyName.trim());
    toast.success(`Company created. Credentials: ${username} / ${password}`);
    setCompanyName("");
  };

  const pendingApplicants = Object.values(state.applicants).filter((a) => a.submitted && !a.approved);

  const toggleDoc = (name: string) => setSelection((s) => ({ ...s, [name]: !s[name] }));

  const onApprove = (applicantId: string) => {
    const picked = docOptions.filter((d) => selection[d]);
    if (picked.length === 0) {
      toast.error("Pick at least one document for the kit");
      return;
    }
    approveApplicant(applicantId);
    setDocumentKit(applicantId, picked);
    toast.success("Applicant approved and document kit created");
    setSelection({});
  };

  const credentials = getAllCredentials();

  return (
    <main className="min-h-screen p-6">
      <Helmet>
        <title>Admin | Proforma Workflow</title>
        <meta name="description" content="Admin panel for managing companies, approvals, and proformas." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/admin"} />
      </Helmet>
      <div className="container mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
          <Button variant="secondary" onClick={logout}>Log out</Button>
        </div>

        <Tabs defaultValue="create" className="w-full">
          <TabsList>
            <TabsTrigger value="create">Create Foreign Company</TabsTrigger>
            <TabsTrigger value="approvals">Approvals & Kit</TabsTrigger>
            <TabsTrigger value="proformas">Proformas 3-6</TabsTrigger>
            <TabsTrigger value="credentials">All Credentials</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create Foreign Company</CardTitle>
                <CardDescription>Generate login credentials and share with the company.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onCreateCompany} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="fc-name">Company name</Label>
                    <Input id="fc-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g. Globex International" />
                  </div>
                  <div className="pt-6 sm:pt-0">
                    <Button type="submit" className="w-full">Create</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approvals">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Applicant Approvals</CardTitle>
                  <CardDescription>Approve submitted applications and create document kits.</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingApplicants.length === 0 ? (
                    <p className="text-muted-foreground">No pending approvals.</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingApplicants.map((a) => (
                        <div key={a.id} className="border rounded-md p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{a.name}</p>
                              <p className="text-sm text-muted-foreground">Company: {state.companies[a.companyId]?.name ?? a.companyId}</p>
                            </div>
                            <Button onClick={() => onApprove(a.id)}>Approve & Create Kit</Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {docOptions.map((d) => (
                              <label key={d} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={!!selection[d]} onChange={() => toggleDoc(d)} />
                                {d}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Tips</CardTitle>
                  <CardDescription>Use generated credentials to sign in as different roles.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                    <li>After creating a company, share the credentials with them.</li>
                    <li>Companies can create applicants and share their credentials.</li>
                    <li>Applicants fill Proforma 1 and submit for approval.</li>
                    <li>Approve and bundle documents into a kit for the applicant.</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="proformas">
            <div className="grid md:grid-cols-2 gap-6">
              {[3,4,5,6].map((num) => (
                <Card key={num}>
                  <CardHeader>
                    <CardTitle>Proforma {num}</CardTitle>
                    <CardDescription>Admin-only placeholder page.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">This is a placeholder for Proforma {num}. You can extend this later.</p>
                  </CardContent>
                </Card>
              ))}
              {(["Invitation Letter","Undertaking"]).map((name) => (
                <Card key={name}>
                  <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>Admin-only placeholder page.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">This is a placeholder for {name}. You can extend this later.</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="credentials">
            <Card>
              <CardHeader>
                <CardTitle>All Credentials</CardTitle>
                <CardDescription>Includes admin, companies, and applicants.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Role</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Linked ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {credentials.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="capitalize">{c.role}</TableCell>
                        <TableCell className="font-mono text-sm">{c.username}</TableCell>
                        <TableCell className="font-mono text-sm">{c.password}</TableCell>
                        <TableCell className="font-mono text-xs">{c.linkedId ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AdminDashboard;
