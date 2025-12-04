"use client"

interface SidebarProps {
  currentView: "products" | "orders"
  onViewChange: (view: "products" | "orders") => void
  onLogout: () => void
}

export default function AdminSidebar({ currentView, onViewChange, onLogout }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-sidebar-accent rounded-full flex items-center justify-center font-bold text-sidebar-accent-foreground">
            C
          </div>
          <h2 className="text-xl font-bold text-sidebar-foreground">CafeITO</h2>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => onViewChange("products")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
              currentView === "products"
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            📦 Productos
          </button>
          <button
            onClick={() => onViewChange("orders")}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
              currentView === "orders"
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            📋 Órdenes
          </button>
        </nav>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 rounded-lg border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent font-semibold transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
