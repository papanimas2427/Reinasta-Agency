import React from 'react';

interface ReinastaLogoProps {
  className?: string;
  textColor?: string;
  tagline?: boolean;
}

/**
 * Text-based REINASTA Agency Brand Title component (no graphic logo/emblem)
 */
export const ReinastaLogo: React.FC<ReinastaLogoProps> = ({
  className = '',
  textColor = '#ED1C24',
  tagline = false,
}) => {
  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <span className="font-extrabold text-xl sm:text-2xl tracking-tight" style={{ color: textColor }}>
        REINASTA Agency
      </span>
      {tagline && (
        <span className="text-[10px] font-extrabold tracking-widest text-[#ED1C24] uppercase">
          PRUDENTIAL AGENCY
        </span>
      )}
    </div>
  );
};

export const ReinastaEmblem: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`font-black text-[#ED1C24] ${className}`}>REINASTA Agency</span>
);
