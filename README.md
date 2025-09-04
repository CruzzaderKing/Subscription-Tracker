# Трекер подписок и платежей

🚀 [Онлайн запуск](https://subscription-tracker-obck.vercel.app)


Удобный трекер для управления подписками и автоматическими платежами.  
Следи за расходами, не пропускай даты списаний и держи финансы под контролем.

---

## 🔍 Основные функции

- ✅ **Регистрация и вход** через email и Google
- ✅ **Управление подписками**: добавление, редактирование, удаление с подтверждением
- ✅ **Фильтрация и сортировка** по статусу (Активна, Отменена, Остановлена)
- ✅ **Итоговая сумма активных подписок**
- ✅ **Адаптивный интерфейс** — работает на мобильных и десктопе
- ✅ **Хранение данных в Firebase Firestore** — безопасно и в реальном времени

---

## 🛠 Стек технологий

| Категория | Технология |
|--------|-----------|
| Фронтенд | React + TypeScript |
| UI-библиотека | Chakra UI |
| Роутинг | React Router |
| Сборка | Vite |
| Бэкенд | Firebase (Auth, Firestore) |
| Хостинг | Vercel |
| Контроль версий | Git + GitHub |

---

## 🚀 Как запустить локально

1. Клонирровать репозиторий:
   git clone https://github.com/CruzzaderKing/Subscription-Tracker.git
   cd Subscription-Tracker
2. Установить зависимости проекта
   npm install
3. Создать файл .env в корне проекта
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
4. Запуск dev сервера
   npm run dev
