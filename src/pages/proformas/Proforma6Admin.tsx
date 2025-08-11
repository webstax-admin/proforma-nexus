import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Proforma6Admin = () => {
  return (
    <main className="min-h-screen p-6">
      <Helmet>
        <title>Proforma 6 | Admin</title>
        <meta name="description" content="Admin placeholder page for Proforma 6." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/admin/proforma-6"} />
      </Helmet>
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-semibold">Proforma 6</h1>
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Proforma 6</CardTitle>
            <CardDescription>Admin-only placeholder page.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Build the actual form later.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Proforma6Admin;
