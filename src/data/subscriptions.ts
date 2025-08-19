// src/data/subscriptions.ts
import { type Subscription } from '../types/subscription';

export const subscriptions: Subscription[] = [
  { id: 1, name: 'Netflix (Premium)', status: 'Активна', cycle: 'Ежемесячно', startDate: '15 сен 2025 г.', amount: 1199 },
  { id: 2, name: 'Яндекс Плюс', status: 'Активна', cycle: 'Ежемесячно', startDate: '1 окт 2025 г.', amount: 299 },
  { id: 3, name: 'Adobe CC', status: 'Отменена', cycle: 'Ежемесячно', startDate: '--------', amount: 5290 },
  { id: 4, name: 'PlayStation Plus Extra', status: 'Активна', cycle: 'Ежегодно', startDate: '10 янв 2026 г.', amount: 7199 },
  { id: 5, name: 'GitHub Pro', status: 'Остановлена', cycle: 'Ежемесячно', startDate: '4 окт 2025 г.', amount: 380 },
  { id: 6, name: 'Проделение домен.ru', status: 'Активна', cycle: 'Ежегодно', startDate: '18 дек 2025 г.', amount: 990 },
  { id: 7, name: 'Мобильная связь (MTC)', status: 'Активна', cycle: 'Ежемесячно', startDate: '22 сен 2025 г.', amount: 650 },
];