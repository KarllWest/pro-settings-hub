interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon = ({ name, className = "", size = 20 }: IconProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      className={className}
      fill="currentColor"
    >
      {/* Посилаємося на файл у папці public */}
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
};