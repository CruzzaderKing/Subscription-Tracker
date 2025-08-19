// import { Routes, Route, Navigate } from "react-router-dom";
// import { RequireAuth } from "@/auth/RequireAuth";
// import RegisterPage from "@/pages/auth/Register";
// import LoginPage from "@/pages/auth/Login";
// import DashboardLayout from "@/layouts/DashboardLayout";
// import SubscribesPage from "@/pages/subscribes/Page";
// import SubscriptionFormPage from "@/pages/subscribes/Form";
// import StatsPage from "@/pages/stats/Page";


// export default function AppRoutes() {
// return (
// <Routes>
// {/* Публичные */}
// <Route path="/auth/register" element={<RegisterPage />} />
// <Route path="/auth/login" element={<LoginPage />} />


// {/* Защищённая область */}
// <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
// <Route path="/subscribes" element={<SubscribesPage />} />
// <Route path="/subscribes/new" element={<SubscriptionFormPage />} />
// <Route path="/subscribes/:id/edit" element={<SubscriptionFormPage />} />
// <Route path="/stats" element={<StatsPage />} />
// </Route>


// {/* Редиректы */}
// <Route path="/" element={<Navigate to="/subscribes" replace />} />
// <Route path="*" element={<Navigate to="/subscribes" replace />} />
// </Routes>
// );
// }