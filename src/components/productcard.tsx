import { useState } from "react";

interface Item {
  id: string;
  name: string;
  price: number;
  imageUrl: string; // Added imageUrl to the Item interface
}

interface ProductCardProps {
  item: Item;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const [isDisabled] = useState(false);

  const handleBuyClick = () => {
    const message = `Olá, gostaria de comprar o item "${item.name}" com o preço de ${item.price},00 AOA.`;
    const phoneNumber = "+244943670112"; // Substitua pelo seu número de telefone
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="border cursor-pointer border-neutral-800 bg-dark text-white w-full max-w-sm rounded-lg overflow-hidden shadow-md">
      <div>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-80 object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <div className="flex items-center justify-between">
          {!isDisabled && (
            <span className="text-2xl font-bold">{item.price},00 AOA</span>
          )}
          <a>
            <button
              onClick={handleBuyClick}
              className={`w-full font-bold rounded-md px-4 py-2 text-sm  transition-colors ${
                isDisabled
                  ? "bg-neutral-300 text-black cursor-not-allowed"
                  : "bg-white text-black hover:bg-neutral-200"
              }`}
              disabled={isDisabled}
            >
              COMPRAR
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
