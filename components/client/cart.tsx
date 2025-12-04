"use client"

interface CartItem {
  id: number
  name: string
  price: number | string
  quantity: number
}

interface CartProps {
  items: CartItem[]
  onRemove: (productId: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onCheckout: () => void
}

export default function Cart({ items, onRemove, onUpdateQuantity, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => {
    const price = typeof item.price === "string" ? Number.parseFloat(item.price) : item.price
    return sum + (isNaN(price) ? 0 : price) * item.quantity
  }, 0)

  return (
    <div className="cafeito-card p-6 sticky top-24">
      <h2 className="text-xl font-bold mb-4">Carrito</h2>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Carrito vacío</p>
      ) : (
        <>
          <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
            {items.map((item) => {
              const price = typeof item.price === "string" ? Number.parseFloat(item.price) : item.price
              const displayPrice = isNaN(price) ? 0 : price
              return (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${displayPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center bg-white rounded"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center bg-white rounded"
                    >
                      +
                    </button>
                    <button onClick={() => onRemove(item.id)} className="ml-2 text-destructive font-bold">
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-t border-border pt-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Total:</span>
              <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={onCheckout}
            className="w-full cafeito-button-primary py-3 rounded-lg font-bold text-lg hover:bg-primary/90 transition"
          >
            Proceder a Pagar
          </button>
        </>
      )}
    </div>
  )
}
