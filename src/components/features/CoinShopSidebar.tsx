/**
 * Coin Shop Sidebar Component
 * Displays coin purchase packs for in-app currency
 */

export const CoinShopSidebar = () => {
  const packs = [
    { coins: 500, price: "$4.99", label: "Starter Pack" },
    { coins: 2500, price: "$19.99", label: "Pro Bundle", popular: true },
    { coins: 7000, price: "$49.99", label: "Founder Vault" }
  ];

  const handlePurchase = (pack: typeof packs[0]) => {
    console.log('[MOCK] Purchase:', pack);
    // TODO: Implement Stripe checkout or payment integration
  };

  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
      <h3 className="text-white font-bold mb-4 italic uppercase">Get Coins</h3>
      <div className="space-y-3">
        {packs.map((pack) => (
          <button
            key={pack.coins}
            onClick={() => handlePurchase(pack)}
            className={`w-full p-3 rounded-lg flex justify-between items-center transition active:scale-95 ${
              pack.popular
                ? 'bg-yellow-600 border-2 border-white'
                : 'bg-black border border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="text-left">
              <span className="block text-xs text-gray-400">{pack.label}</span>
              <span className="font-black text-white">{pack.coins} COINS</span>
            </div>
            <span className="font-bold text-white">{pack.price}</span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-gray-500 mt-4 leading-tight">
        Coins are non-crypto in-app currency. All sales are final and tied to your Vertikal profile.
      </p>
    </div>
  );
};

