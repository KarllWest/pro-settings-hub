import type { SVGProps } from 'react';

// Список усіх ID, які є у твоєму спрайті (в Home.tsx/App.tsx)
export type IconName = 
  | 'cs2_logo'
  | 'dota_logo'      // Зверни увагу: у спрайті в Home.tsx було 'dota_logo', а не 'dota2_logo'
  | 'valorant_logo'
  | 'icon-hltv' 
  | 'icon-faceit' 
  | 'icon-dotabuff' 
  | 'icon-liquipedia' 
  | 'icon-instagram';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export const Icon = ({ name, className, ...props }: IconProps) => {
  return (
    <svg className={className} fill="currentColor" {...props}>
      <use href={`#${name}`} />
    </svg>
  );
};