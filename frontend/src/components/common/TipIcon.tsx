/**
 * TipIcon Component
 * Small info icon that appears next to field labels
 * Shows tooltip on hover, opens modal on click
 */

interface TipIconProps {
  fieldName: string;
  tooltip?: string;
  priority?: 'info' | 'warning' | 'critical';
  onClick: () => void;
}

export default function TipIcon({ fieldName, tooltip, priority = 'info', onClick }: TipIconProps) {
  // Icon and color based on priority
  const getIconAndStyle = () => {
    switch (priority) {
      case 'critical':
        return { icon: '⚠️', color: 'text-red-600', bg: 'hover:bg-red-50' };
      case 'warning':
        return { icon: '❗', color: 'text-amber-600', bg: 'hover:bg-amber-50' };
      default:
        return { icon: 'ℹ️', color: 'text-blue-600', bg: 'hover:bg-blue-50' };
    }
  };

  const { icon, color, bg } = getIconAndStyle();

  return (
    <button
      onClick={onClick}
      type="button"
      className={`ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full transition-all ${bg} ${color} cursor-pointer`}
      aria-label={`Get help for ${fieldName}`}
      title={tooltip || 'Click for detailed help'}
    >
      <span className="text-sm">{icon}</span>
    </button>
  );
}
