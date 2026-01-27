import { useState, useMemo } from "react";
import { X, Search, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import type { StockItem, SaleDTO } from "../../types/dashboard";

interface SaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sale: SaleDTO) => Promise<void>;
  products: StockItem[];
}

export function SaleModal({ isOpen, onClose, onSave, products }: SaleModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<{ product: StockItem; quantity: number }[]>([]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

  const addToCart = (product: StockItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("No hay más stock disponible para este producto.");
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      if (product.stock <= 0) {
        alert("Producto sin stock.");
        return prev;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.product.stock) {
          alert("No hay más stock disponible.");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    setLoading(true);
    try {
      const saleDTO: SaleDTO = {
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      await onSave(saleDTO);
      setCart([]);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingCart size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Realizar Nueva Venta</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-hidden">
          
          {/* Left Side: Product Selector */}
          <div className="p-6 border-r border-slate-100 flex flex-col gap-4 overflow-hidden">
            {/* Product Search & List */}
            <div className="flex-1 flex flex-col min-h-0 gap-3">
              <label className="block text-sm font-medium text-slate-700">Explorador de Productos</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Filtrar por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-50">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => {
                    const inCart = cart.find(i => i.product.id === product.id);
                    return (
                      <div
                        key={product.id}
                        className="p-3 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-medium text-slate-800 truncate text-sm">{product.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{product.description}</div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-bold text-blue-600 text-sm">${product.price}</div>
                            <div className={`text-[10px] ${product.stock < 5 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                              Stock: {product.stock}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            disabled={product.stock <= 0 || (inCart?.quantity || 0) >= product.stock}
                            className="bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 p-2 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-600"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-slate-400 text-sm italic">No se encontraron productos</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Cart Summary */}
          <div className="p-6 bg-slate-50/50 flex flex-col gap-4 overflow-hidden">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ShoppingCart size={18} className="text-slate-400" />
              Detalle del Carrito
              <span className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-normal ml-auto">
                {cart.length} items
              </span>
            </h3>
            
            <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-1">
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.product.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group">
                    <div className="min-w-0 pr-2">
                      <div className="font-medium text-slate-800 text-sm truncate">{item.product.name}</div>
                      <div className="text-blue-600 font-bold text-sm">${(item.product.price * item.quantity).toFixed(2)}</div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 hover:bg-white rounded text-slate-500 transition-colors shadow-none hover:shadow-sm"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 hover:bg-white rounded text-slate-500 transition-colors shadow-none hover:shadow-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 border-2 border-dashed border-slate-200 rounded-xl">
                  <ShoppingCart size={32} className="opacity-20" />
                  <p className="text-xs">El carrito está vacío</p>
                </div>
              )}
            </div>

            {/* Total Indicator */}
            <div className="mt-auto pt-4 border-t border-slate-200">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total a pagar</div>
                  <div className="text-3xl font-black text-slate-800">${total.toFixed(2)}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg font-medium transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || cart.length === 0}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all shadow-md shadow-blue-200 disabled:opacity-50 disabled:shadow-none min-w-30 text-sm"
                  >
                    {loading ? "Procesando..." : "Finalizar Venta"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
