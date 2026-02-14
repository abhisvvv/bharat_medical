import { useState } from "react";
import { mockMedicines, mockBills } from "@/data/mockData";
import { Bill, BillItem, Medicine } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Receipt } from "lucide-react";

export default function Billing() {
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<BillItem[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMode, setPaymentMode] = useState<Bill["paymentMode"]>("Cash");
  const [paidAmount, setPaidAmount] = useState(0);

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const udharAmount = Math.max(0, totalAmount - paidAmount);

  const addItem = () => {
    const med = mockMedicines.find((m) => m.id === selectedMedicine);
    if (!med || quantity <= 0) return;
    const existing = items.find((i) => i.medicineId === med.id);
    if (existing) {
      setItems(items.map((i) => (i.medicineId === med.id ? { ...i, quantity: i.quantity + quantity } : i)));
    } else {
      setItems([...items, { medicineId: med.id, medicineName: med.name, quantity, price: med.sellingPrice }]);
    }
    setSelectedMedicine("");
    setQuantity(1);
  };

  const removeItem = (id: string) => setItems(items.filter((i) => i.medicineId !== id));

  const generateBill = () => {
    if (!customerName.trim() || items.length === 0) return;
    const newBill: Bill = {
      id: `B${String(bills.length + 1).padStart(3, "0")}`,
      customerName: customerName.trim(),
      medicines: items,
      totalAmount,
      paidAmount: Math.min(paidAmount, totalAmount),
      udharAmount,
      date: new Date().toISOString().split("T")[0],
      paymentMode,
    };
    setBills([newBill, ...bills]);
    setCustomerName("");
    setItems([]);
    setPaidAmount(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-header">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create bills and manage transactions</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* New Bill Form */}
        <div className="glass-card xl:col-span-1 space-y-4">
          <h3 className="font-heading text-lg font-semibold">New Bill</h3>

          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter customer name" />
          </div>

          <div className="space-y-2">
            <Label>Add Medicine</Label>
            <div className="flex gap-2">
              <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select medicine" />
                </SelectTrigger>
                <SelectContent>
                  {mockMedicines.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} — ₹{m.sellingPrice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                className="w-16"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(+e.target.value)}
              />
              <Button size="icon" onClick={addItem}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="space-y-2 rounded-lg border p-3">
              {items.map((item) => (
                <div key={item.medicineId} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium">{item.medicineName}</span>
                    <span className="text-muted-foreground"> × {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>₹{item.price * item.quantity}</span>
                    <button onClick={() => removeItem(item.medicineId)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <div className="border-t pt-2 font-heading text-base font-semibold">
                Total: ₹{totalAmount}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <Select value={paymentMode} onValueChange={(v) => setPaymentMode(v as Bill["paymentMode"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Udhar">Udhar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Paid Amount ₹</Label>
              <Input type="number" value={paidAmount} onChange={(e) => setPaidAmount(+e.target.value)} />
            </div>
          </div>

          {udharAmount > 0 && (
            <p className="text-sm text-destructive font-medium">Udhar: ₹{udharAmount}</p>
          )}

          <Button className="w-full" onClick={generateBill} disabled={!customerName.trim() || items.length === 0}>
            <Receipt className="mr-2 h-4 w-4" />
            Generate Bill
          </Button>
        </div>

        {/* Bills List */}
        <div className="glass-card xl:col-span-2 p-0 overflow-x-auto">
          <div className="p-4 border-b">
            <h3 className="font-heading text-lg font-semibold">Recent Bills</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-muted-foreground">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Paid</th>
                <th className="p-4 font-medium">Udhar</th>
                <th className="p-4 font-medium">Mode</th>
                <th className="p-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((b) => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-mono text-xs">{b.id}</td>
                  <td className="p-4 font-medium">{b.customerName}</td>
                  <td className="p-4 text-xs text-muted-foreground">{b.medicines.length} items</td>
                  <td className="p-4 font-medium">₹{b.totalAmount}</td>
                  <td className="p-4 text-success">₹{b.paidAmount}</td>
                  <td className="p-4 text-destructive">{b.udharAmount > 0 ? `₹${b.udharAmount}` : "—"}</td>
                  <td className="p-4"><Badge variant="secondary">{b.paymentMode}</Badge></td>
                  <td className="p-4 text-xs">{b.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
