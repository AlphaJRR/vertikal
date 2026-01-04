export const FoundingBadge = () => {
  return (
    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-900 border border-slate-500/50 text-white text-[9px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-gray-700/50 z-20 whitespace-nowrap overflow-hidden">
      <svg
        width="10"
        height="10"
        viewBox="0 0 100 100"
        fill="none"
        stroke="white"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mr-0.5"
      >
        <path d="M25 40 L50 65 L75 25" />
        <path d="M75 25 L 55 25" />
      </svg>
      <span className="animate-shine">FOUNDING 50</span>
    </div>
  );
};


