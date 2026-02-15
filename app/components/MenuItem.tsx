import { MenuItem } from '../types/menu';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface MenuItemProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

const categoryEmojis: Record<string, string> = {
  coffee: '☕',
  pastries: '🥐',
  sandwiches: '🥪',
  beverages: '🥤',
};

const categoryLabels: Record<string, string> = {
  coffee: 'Café',
  pastries: 'Pasteles',
  sandwiches: 'Sándwiches',
  beverages: 'Bebidas',
};

export default function MenuItemComponent({ item, onAddToCart }: MenuItemProps) {
  return (
    <Card variant="elevated" padding="md" className="flex flex-col h-full overflow-hidden hover:shadow-soft-lg">
      {/* Image Placeholder */}
      <div className="bg-gradient-to-br from-beige-100 to-beige-200 h-40 flex items-center justify-center rounded-md mb-4">
        <span className="text-5xl">{categoryEmojis[item.category]}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Category Badge */}
        <Badge variant="info" size="sm">
          {categoryLabels[item.category]}
        </Badge>

        {/* Name */}
        <div>
          <h3 className="text-lg font-bold text-coffee-900 line-clamp-2">{item.name}</h3>
          <p className="text-sm text-coffee-600 leading-relaxed line-clamp-2 mt-1">
            {item.description}
          </p>
        </div>

        {/* Price and Button */}
        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="text-2xl font-bold text-coffee-700">${item.price.toFixed(2)}</div>
          <Button
            onClick={() => onAddToCart(item)}
            disabled={!item.available}
            size="sm"
            variant={item.available ? 'primary' : 'ghost'}
            icon={item.available ? '➕' : '❌'}
          >
            <span className="hidden sm:inline">{item.available ? 'Agregar' : 'No disponible'}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
