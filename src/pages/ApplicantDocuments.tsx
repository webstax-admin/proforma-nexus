import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { useAppState } from "@/store/app-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ApplicantDocuments = () => {
  const { id } = useParams();
  const { state, logout } = useAppState();
  const applicant = id ? state.applicants[id] : undefined;

  if (!applicant) return <main className="p-6">Applicant not found.</main>;

  return (
    <main className="min-h-screen p-6">
      <Helmet>
        <title>Applicant | Documents Kit</title>
        <meta name="description" content="View your generated document kit." />
      </Helmet>
      <div className="container mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Documents for {applicant.name}</h1>
          <Button variant="secondary" onClick={logout}>Log out</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generated Documents</CardTitle>
            <CardDescription>These were selected by the admin during approval.</CardDescription>
          </CardHeader>
          <CardContent>
            {applicant.documents.length === 0 ? (
              <p className="text-muted-foreground">No documents found.</p>
            ) : (
              <ul className="list-disc pl-6 space-y-2">
                {applicant.documents.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ApplicantDocuments;
