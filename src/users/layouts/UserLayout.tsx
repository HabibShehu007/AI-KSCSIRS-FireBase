import Header from "../dashboard/Header";
import Footer from "../dashboard/Footer"; // ✅ import footer
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <Footer /> {/* ✅ footer always at bottom */}
    </div>
  );
}
