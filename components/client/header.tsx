"use client"

interface HeaderProps {
  cartCount: number
  onCartClick: () => void
}

export default function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="cafeito-header sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center font-bold text-primary">
              C
            </div>
            <h1 className="text-2xl font-bold">CafeITO</h1>
          </div>
          <button
            onClick={onCartClick}
            className="relative px-4 py-2 rounded-lg bg-primary-foreground text-primary font-semibold hover:bg-opacity-90 transition"
          >
            🛒 Carrito ({cartCount})
          </button>
        </div>
      </div>
    </header>
  )
}
