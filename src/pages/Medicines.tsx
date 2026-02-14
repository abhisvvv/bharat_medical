import { useState } from "react";
import { mockMedicines } from "@/data/mockData";
import { Medicine, MedicineType } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, Pill } from "lucide-react";

const typeColors: Record<MedicineType, string> = {
  Allopathy: "bg-info/10 text-info border-info/20",
  Generic: "bg-success/10 text-success border-success/20",
  Homeopathy: "bg-warning/10 text-warning border-warning/20",
};

export default function Medicines() {
  const [medicines, setMedicines] = useState<Medicine[]>(mockMedicines);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Partial<Medicine>>({
    type: "Allopathy",
  });

  const filtered = medicines.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || m.type === filterType;
    return matchSearch && matchType;
  });

  const handleAdd = () => {
    if (!form.name || !form.company || !form.batchNo) return;
    const newMed: Medicine = {
      id: Date.now().toString(),
      name: form.name || "",
      company: form.company || "",
      type: (form.type as MedicineType) || "Allopathy",
      batchNo: form.batchNo || "",
      expiryDate: form.expiryDate || "",
      purchasePrice: form.purchasePrice || 0,
      sellingPrice: form.sellingPrice || 0,
      stock: form.stock || 0,
      boxCount: form.boxCount || 0,
      unitsPerBox: form.unitsPerBox || 0,
    };
    setMedicines([newMed, ...medicines]);
    setForm({ type: "Allopathy" });
    setDialogOpen(false);
  };

  const getStockBadge = (stock: number) => {
    if (stock <= 5) return <Badge variant="destructive">Critical</Badge>;
    if (stock <= 15) return <Badge className="bg-warning text-warning-foreground">Low</Badge>;
    return <Badge variant="secondary">OK</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-header">Medicines</h1>
          <p className="mt-1 text-sm text-muted-foreground">{medicines.length} medicines in inventory</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Medicine</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Medicine Name</Label>
                  <Input
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Paracetamol 500mg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={form.company || ""}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Cipla"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as MedicineType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Allopathy">Allopathy</SelectItem>
                      <SelectItem value="Generic">Generic</SelectItem>
                      <SelectItem value="Homeopathy">Homeopathy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Batch No</Label>
                  <Input
                    value={form.batchNo || ""}
                    onChange={(e) => setForm({ ...form, batchNo: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Purchase ₹</Label>
                  <Input
                    type="number"
                    value={form.purchasePrice || ""}
                    onChange={(e) => setForm({ ...form, purchasePrice: +e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Selling ₹</Label>
                  <Input
                    type="number"
                    value={form.sellingPrice || ""}
                    onChange={(e) => setForm({ ...form, sellingPrice: +e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={form.stock || ""}
                    onChange={(e) => setForm({ ...form, stock: +e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    value={form.expiryDate || ""}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Boxes</Label>
                  <Input
                    type="number"
                    value={form.boxCount || ""}
                    onChange={(e) => setForm({ ...form, boxCount: +e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Units/Box</Label>
                  <Input
                    type="number"
                    value={form.unitsPerBox || ""}
                    onChange={(e) => setForm({ ...form, unitsPerBox: +e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAdd} className="mt-2">Add Medicine</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search medicines or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Allopathy">Allopathy</SelectItem>
            <SelectItem value="Generic">Generic</SelectItem>
            <SelectItem value="Homeopathy">Homeopathy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-muted-foreground">
              <th className="p-4 font-medium">Medicine</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Batch</th>
              <th className="p-4 font-medium">Expiry</th>
              <th className="p-4 font-medium">Purchase ₹</th>
              <th className="p-4 font-medium">Selling ₹</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <p className="font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.company}</p>
                </td>
                <td className="p-4">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${typeColors[m.type]}`}>
                    {m.type}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs">{m.batchNo}</td>
                <td className="p-4 text-xs">{m.expiryDate}</td>
                <td className="p-4">₹{m.purchasePrice}</td>
                <td className="p-4 font-medium">₹{m.sellingPrice}</td>
                <td className="p-4">{m.stock}</td>
                <td className="p-4">{getStockBadge(m.stock)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Pill className="mb-2 h-8 w-8" />
            <p>No medicines found</p>
          </div>
        )}
      </div>
    </div>
  );
}
