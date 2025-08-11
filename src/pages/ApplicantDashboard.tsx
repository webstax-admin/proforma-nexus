import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useAppState } from "@/store/app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ApplicantDashboard = () => {
  const { id } = useParams();
  const { state, logout } = useAppState();
  const applicant = id ? state.applicants[id] : undefined;

  if (!applicant) return <main className="p-6">Applicant not found.</main>;

  const approved = applicant.approved;

  return (
    <main className="min-h-screen p-6">
      <Helmet>
        <title>Applicant | Dashboard</title>
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
            <CardDescription>Go to the Proforma 1 page to edit and submit.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to={`/applicant/${applicant.id}/proforma-1`}>Open Proforma 1</Link>
            </Button>
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
