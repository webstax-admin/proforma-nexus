import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const InvitationLetterAdmin = () => {
  return (
    <main className="min-h-screen p-6">
      <Helmet>
        <title>Invitation Letter | Admin</title>
        <meta name="description" content="Admin placeholder page for Invitation Letter." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/admin/invitation-letter"} />
      </Helmet>
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-semibold">Invitation Letter</h1>
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Invitation Letter</CardTitle>
            <CardDescription>Admin-only placeholder page.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Build the actual content later.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default InvitationLetterAdmin;
