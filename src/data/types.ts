export type MedicineType = "Allopathy" | "Generic" | "Homeopathy";

export interface Medicine {
  id: string;
  name: string;
  company: string;
  type: MedicineType;
  batchNo: string;
  expiryDate: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  boxCount: number;
  unitsPerBox: number;
}

export interface BillItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
}

export interface Bill {
  id: string;
  customerName: string;
  medicines: BillItem[];
  totalAmount: number;
  paidAmount: number;
  udharAmount: number;
  date: string;
  paymentMode: "Cash" | "UPI" | "Card" | "Udhar";
}

export interface Payment {
  id: string;
  date: string;
  totalSales: number;
  totalProfit: number;
  udharCollected: number;
  udharGiven: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  medicines: string[];
  lastPurchaseDate: string;
  pendingPayment: number;
}

export interface DashboardStats {
  todaySales: number;
  todayProfit: number;
  monthlyProfit: number;
  totalUdhar: number;
  lowStockCount: number;
  expiryWarningCount: number;
}
