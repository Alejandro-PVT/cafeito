import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-dark to-primary-darker flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-6xl font-bold text-primary-foreground mb-4">☕ CafeITO</div>
          <p className="text-2xl text-primary-foreground/90 mb-2">Plataforma de Punto de Venta</p>
          <p className="text-lg text-primary-foreground/70">La mejor cafetería a tu alcance</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
          <Link
            href="/cliente"
            className="px-8 py-4 bg-accent text-accent-foreground rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition transform"
          >
            🛒 Comprar Productos
          </Link>
          <Link
            href="/admin"
            className="px-8 py-4 bg-primary-foreground text-primary rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition transform"
          >
            🔐 Panel Administrativo
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div className="text-primary-foreground/80">
            <div className="text-4xl mb-2">☕</div>
            <p className="font-semibold">Café Premium</p>
          </div>
          <div className="text-primary-foreground/80">
            <div className="text-4xl mb-2">🥐</div>
            <p className="font-semibold">Pan Fresco</p>
          </div>
          <div className="text-primary-foreground/80">
            <div className="text-4xl mb-2">🎁</div>
            <p className="font-semibold">Accesorios</p>
          </div>
        </div>
      </div>
    </div>
  )
}
