import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { getEvents, AnalyticsEvent } from "@/lib/analytics";
import { useAppState } from "@/store/app-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const Analytics = () => {
  const { state } = useAppState();
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [companyId, setCompanyId] = useState<string>("all");
  const [applicantId, setApplicantId] = useState<string>("all");
  const [type, setType] = useState<string>("all");

  const events = getEvents();

  const years = useMemo(() => {
    const s = new Set<string>();
    events.forEach(e => s.add(new Date(e.timestamp).getFullYear().toString()));
    return ["all", ...Array.from(s).sort()];
  }, [events]);

  const types = useMemo(() => ["all", ...Array.from(new Set(events.map(e => e.type)))], [events]);

  const filtered = useMemo(() => {
    return events.filter(e => {
      const d = new Date(e.timestamp);
      const mOk = month === "all" || (d.getMonth().toString() === month);
      const yOk = year === "all" || (d.getFullYear().toString() === year);
      const cOk = companyId === "all" || e.companyId === companyId;
      const aOk = applicantId === "all" || e.applicantId === applicantId;
      const tOk = type === "all" || e.type === type;
      return mOk && yOk && cOk && aOk && tOk;
    });
  }, [events, month, year, companyId, applicantId, type]);

  const barData = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach(e => { map[e.type] = (map[e.type] ?? 0) + 1; });
    return Object.entries(map).map(([k, v]) => ({ type: k, count: v }));
  }, [filtered]);

  return (
    <main className="min-h-screen p-6">
      <Helmet>
        <title>Analytics | Admin</title>
        <meta name="description" content="Event analytics with filters by month, year, company, applicant." />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/admin/analytics"} />
      </Helmet>
      <div className="container mx-auto space-y-8">
        <h1 className="text-3xl font-semibold">Analytics</h1>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Refine the analytics by time and entity.</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm block mb-1">Month</label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {monthNames.map((m, i) => (
                    <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm block mb-1">Year</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={y}>{y === "all" ? "All" : y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm block mb-1">Company</label>
              <Select value={companyId} onValueChange={setCompanyId}>
                <SelectTrigger><SelectValue placeholder="Company" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Object.values(state.companies).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm block mb-1">Applicant</label>
              <Select value={applicantId} onValueChange={setApplicantId}>
                <SelectTrigger><SelectValue placeholder="Applicant" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {Object.values(state.applicants).map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm block mb-1">Event Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t} value={t}>{t === "all" ? "All" : t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events by Type</CardTitle>
            <CardDescription>Distribution of events for the selected filters.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[320px]" config={{ count: { label: "Count", color: "hsl(var(--primary))" } }}>
              <BarChart data={barData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="type" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Newest first</CardDescription>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events match filters.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Applicant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((e: AnalyticsEvent) => (
                    <TableRow key={e.id}>
                      <TableCell>{new Date(e.timestamp).toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-xs">{e.type}</TableCell>
                      <TableCell className="capitalize">{e.actorRole}</TableCell>
                      <TableCell>{e.companyId ? state.companies[e.companyId]?.name ?? e.companyId : "-"}</TableCell>
                      <TableCell>{e.applicantId ? state.applicants[e.applicantId]?.name ?? e.applicantId : "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Analytics;
