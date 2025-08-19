//src/types/subscriptiopn.ts
export interface Subscription {
  id: string;
  name: string;
  status: "Активна" | "Остановлена" | "Отменена";
  cycle: string;
  startDate: string;
  amount: number;
}


