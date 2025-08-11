import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppState } from "@/store/app-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { recordEvent } from "@/lib/analytics";
const Index = () => {
  const { login } = useAppState();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(username.trim(), password.trim());
    if (!res.ok) {
      toast.error("Invalid credentials");
      return;
    }
    if (res.role === "admin") {
      recordEvent({ type: "login_success", actorRole: "admin" });
      nav("/admin");
    }
    if (res.role === "company" && res.linkedId) {
      recordEvent({ type: "login_success", actorRole: "company", companyId: res.linkedId });
      nav(`/company/${res.linkedId}`);
    }
    if (res.role === "applicant" && res.linkedId) {
      recordEvent({ type: "login_success", actorRole: "applicant", applicantId: res.linkedId });
      nav(`/applicant/${res.linkedId}`);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,theme(colors.accent.DEFAULT)_0%,theme(colors.background)_60%)] flex items-center justify-center p-6">
      <Helmet>
        <title>Login | Proforma Workflow</title>
        <meta name="description" content="Login to manage proformas and approvals for admin, companies, and applicants." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/"} />
      </Helmet>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Use your credentials to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. aarnav" autoComplete="username" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full">Sign in</Button>
            <p className="text-sm text-muted-foreground">Default admin: username "aarnav" password "aarnav"</p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default Index;
