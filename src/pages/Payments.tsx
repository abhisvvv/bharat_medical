import { useState } from "react";
import { mockPayments, mockBills } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IndianRupee, TrendingUp, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function Payments() {
  const [payments] = useState(mockPayments);
  const udharBills = mockBills.filter((b) => b.udharAmount > 0);

  const totalUdhar = udharBills.reduce((sum, b) => sum + b.udharAmount, 0);
  const totalCollected = payments.reduce((sum, p) => sum + p.udharCollected, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Payments & Udhar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track daily payments and credit (udhar) management</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="stat-card stat-card-green">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-85">Total Sales (5d)</p>
              <p className="mt-1 text-2xl font-bold font-heading">₹{payments.reduce((s, p) => s + p.totalSales, 0).toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white/20 p-3"><IndianRupee className="h-6 w-6" /></div>
          </div>
        </div>
        <div className="stat-card stat-card-blue">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-85">Total Profit (5d)</p>
              <p className="mt-1 text-2xl font-bold font-heading">₹{payments.reduce((s, p) => s + p.totalProfit, 0).toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white/20 p-3"><TrendingUp className="h-6 w-6" /></div>
          </div>
        </div>
        <div className="stat-card stat-card-orange">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-85">Udhar Collected</p>
              <p className="mt-1 text-2xl font-bold font-heading">₹{totalCollected.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white/20 p-3"><ArrowDownLeft className="h-6 w-6" /></div>
          </div>
        </div>
        <div className="stat-card stat-card-red">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-85">Pending Udhar</p>
              <p className="mt-1 text-2xl font-bold font-heading">₹{totalUdhar.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white/20 p-3"><ArrowUpRight className="h-6 w-6" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Daily Payments */}
        <div className="glass-card p-0 overflow-x-auto">
          <div className="p-4 border-b">
            <h3 className="font-heading text-lg font-semibold">Daily Payment Log</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Sales</th>
                <th className="p-4 font-medium">Profit</th>
                <th className="p-4 font-medium">Udhar In</th>
                <th className="p-4 font-medium">Udhar Out</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{p.date}</td>
                  <td className="p-4">₹{p.totalSales}</td>
                  <td className="p-4 text-success font-medium">₹{p.totalProfit}</td>
                  <td className="p-4 text-success">{p.udharCollected > 0 ? `₹${p.udharCollected}` : "—"}</td>
                  <td className="p-4 text-destructive">{p.udharGiven > 0 ? `₹${p.udharGiven}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Udhar List */}
        <div className="glass-card p-0 overflow-x-auto">
          <div className="p-4 border-b">
            <h3 className="font-heading text-lg font-semibold">Pending Udhar</h3>
          </div>
          {udharBills.length > 0 ? (
            <div className="divide-y">
              {udharBills.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground">Bill {b.id} · {b.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-lg font-bold text-destructive">₹{b.udharAmount}</span>
                    <Button size="sm" variant="outline">Collect</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <p>No pending udhar! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
