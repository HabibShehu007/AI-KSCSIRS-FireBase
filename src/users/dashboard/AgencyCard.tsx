// src/components/AgencyCard.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { IconType } from "react-icons";

type Props = {
  name: string;
  slug: string;
  icon?: IconType;
  image?: string;
  description: string;
};

export default function AgencyCard({
  name,
  slug,
  icon: Icon,
  image,
  description,
}: Props) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // ✅ Navigate directly to complaint form
  const handleClick = () => {
    navigate(`/user/message/${slug}`);
  };

  return (
    <div
      role="button"
      aria-label={`Report to ${name}`}
      onClick={handleClick}
      className="group bg-white border border-blue-100 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.01] mt-2 mb-2"
    >
      {/* IMAGE */}
      <div className="relative h-52 sm:h-60 md:h-72 lg:h-80 w-full overflow-hidden mt-4 rounded-t-xl">
        {image && !imgError ? (
          <img
            src={image}
            alt={`${name} officer avatar`}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        ) : Icon ? (
          <div className="flex items-center justify-center h-full text-blue-700 text-6xl">
            <Icon />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent group-hover:from-black/20 transition pointer-events-none" />
      </div>

      {/* CONTENT */}
      <div className="px-3 py-3 sm:px-4 sm:py-4 text-center space-y-2 sm:space-y-2.5">
        <h3 className="text-base sm:text-lg font-bold text-[#0a1f44] uppercase tracking-wide group-hover:text-blue-700 transition">
          {name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 font-medium leading-snug">
          {description}
        </p>

        <button
          onClick={handleClick}
          className="w-full px-3 py-1.5 sm:px-5 sm:py-2 bg-[#0a1f44] text-white rounded-full hover:bg-blue-800 transition font-semibold text-xs sm:text-sm shadow-md mt-2"
        >
          Report to {name}
        </button>
      </div>
    </div>
  );
}
