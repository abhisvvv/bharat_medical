import { mockSuppliers } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

export default function Suppliers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Suppliers</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your medicine suppliers and companies</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mockSuppliers.map((s) => (
          <div key={s.id} className="glass-card space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold">{s.name}</h3>
                  <p className="text-xs text-muted-foreground">📞 {s.contact}</p>
                </div>
              </div>
              {s.pendingPayment > 0 ? (
                <Badge variant="destructive">₹{s.pendingPayment} due</Badge>
              ) : (
                <Badge variant="secondary">Paid</Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {s.medicines.map((m) => (
                <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Last purchase: {s.lastPurchaseDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
