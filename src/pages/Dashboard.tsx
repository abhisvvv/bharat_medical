import {
  IndianRupee,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Pill,
  Clock,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { mockDashboardStats, monthlySalesData, mockMedicines, mockBills } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

function StatCard({
  label,
  value,
  icon: Icon,
  variant,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  variant: "green" | "blue" | "orange" | "red";
}) {
  return (
    <div className={`stat-card stat-card-${variant} animate-fade-in`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-85">{label}</p>
          <p className="mt-1 text-2xl font-bold font-heading">{typeof value === "number" ? `₹${value.toLocaleString()}` : value}</p>
        </div>
        <div className="rounded-xl bg-white/20 p-3">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const stats = mockDashboardStats;
  const lowStockMedicines = mockMedicines.filter((m) => m.stock <= 10);
  const expiringMedicines = mockMedicines.filter((m) => {
    const expiry = new Date(m.expiryDate);
    const now = new Date();
    const diffDays = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 90 && diffDays > 0;
  });
  const recentBills = mockBills.slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back! Here's your pharmacy overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Today Sales" value={stats.todaySales} icon={IndianRupee} variant="green" />
        <StatCard label="Today Profit" value={stats.todayProfit} icon={TrendingUp} variant="blue" />
        <StatCard label="Monthly Profit" value={stats.monthlyProfit} icon={Calendar} variant="orange" />
        <StatCard label="Total Udhar" value={stats.totalUdhar} icon={AlertTriangle} variant="red" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="glass-card">
          <h3 className="mb-4 font-heading text-lg font-semibold">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="sales" fill="hsl(168, 70%, 34%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card">
          <h3 className="mb-4 font-heading text-lg font-semibold">Profit Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 13,
                }}
              />
              <Line type="monotone" dataKey="profit" stroke="hsl(210, 80%, 52%)" strokeWidth={2.5} dot={{ fill: "hsl(210, 80%, 52%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Low Stock */}
        <div className="glass-card">
          <div className="mb-4 flex items-center gap-2">
            <Pill className="h-5 w-5 text-warning" />
            <h3 className="font-heading text-lg font-semibold">Low Stock Alerts</h3>
            <Badge variant="destructive" className="ml-auto">{lowStockMedicines.length}</Badge>
          </div>
          <div className="space-y-3">
            {lowStockMedicines.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.company}</p>
                </div>
                <Badge variant="outline" className="border-destructive text-destructive">
                  {m.stock} left
                </Badge>
              </div>
            ))}
            {lowStockMedicines.length === 0 && (
              <p className="text-sm text-muted-foreground">All medicines are well stocked! ✅</p>
            )}
          </div>
        </div>

        {/* Expiry Warnings */}
        <div className="glass-card">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            <h3 className="font-heading text-lg font-semibold">Expiry Warnings</h3>
            <Badge variant="destructive" className="ml-auto">{expiringMedicines.length}</Badge>
          </div>
          <div className="space-y-3">
            {expiringMedicines.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">Batch: {m.batchNo}</p>
                </div>
                <Badge variant="outline" className="border-warning text-warning">
                  Exp: {m.expiryDate}
                </Badge>
              </div>
            ))}
            {expiringMedicines.length === 0 && (
              <p className="text-sm text-muted-foreground">No medicines expiring soon! ✅</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Bills */}
      <div className="glass-card">
        <h3 className="mb-4 font-heading text-lg font-semibold">Recent Bills</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Bill ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Paid</th>
                <th className="pb-3 font-medium">Udhar</th>
                <th className="pb-3 font-medium">Mode</th>
              </tr>
            </thead>
            <tbody>
              {recentBills.map((bill) => (
                <tr key={bill.id} className="border-b last:border-0">
                  <td className="py-3 font-mono text-xs">{bill.id}</td>
                  <td className="py-3">{bill.customerName}</td>
                  <td className="py-3 font-medium">₹{bill.totalAmount}</td>
                  <td className="py-3 text-success">₹{bill.paidAmount}</td>
                  <td className="py-3 text-destructive">{bill.udharAmount > 0 ? `₹${bill.udharAmount}` : "—"}</td>
                  <td className="py-3">
                    <Badge variant="secondary">{bill.paymentMode}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
