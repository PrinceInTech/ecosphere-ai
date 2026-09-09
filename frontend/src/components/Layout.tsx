import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  ScanLine,
  MessageSquare,
  Leaf,
  BarChart3,
  Calculator,
  BookOpen,
  ShieldCheck,
  Menu,
  X,
  Recycle,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/scanner", label: "Scanner", icon: ScanLine },
  { to: "/assistant", label: "Assistant", icon: MessageSquare },
  { to: "/advisor", label: "Advisor", icon: Leaf },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/impact", label: "Impact", icon: Calculator },
  { to: "/knowledge", label: "Knowledge", icon: BookOpen },
  { to: "/responsible-ai", label: "Responsible AI", icon: ShieldCheck },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Recycle size={20} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold gradient-text">
                  EcoSphere AI
                </span>
              </div>
            </NavLink>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                    }`
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in-up">
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <item.icon size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-emerald-100 bg-white/60 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Recycle size={16} className="text-primary" />
              <span>EcoSphere AI</span>
              <span className="text-gray-300">|</span>
              <span>
                Supporting{" "}
                <span className="font-semibold text-primary">SDG 12</span> —
                Responsible Consumption & Production
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Powered by AI for a sustainable future
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
