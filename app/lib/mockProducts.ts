export type Product = {
  id: string;
  name: string;
  price: number;
  cost: number;
  imageUrl?: string;
  isActive: boolean;
  stock?: number;
  description?: string;
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Empanadas',
    price: 2500,
    cost: 1000,
    imageUrl: 'https://placehold.co/600x400/8B7355/FFFFFF?text=Empanadas',
    isActive: true,
    stock: 30,
    description: 'Empanadas tradicionales rellenas de carne',
  },
  {
    id: '2',
    name: 'Chicha de Mora',
    price: 2000,
    cost: 800,
    imageUrl: 'https://placehold.co/600x400/8B3A62/FFFFFF?text=Chicha+Mora',
    isActive: true,
    stock: 15,
    description: 'Bebida tradicional de mora fresca',
  },
  {
    id: '3',
    name: 'Chicha de Maracuyá',
    price: 2000,
    cost: 800,
    imageUrl: 'https://placehold.co/600x400/D4A520/FFFFFF?text=Chicha+Maracuya',
    isActive: true,
    stock: 15,
    description: 'Chicha de maracuyá refrescante',
  },
  {
    id: '4',
    name: 'Chicha de Arroz',
    price: 2000,
    cost: 800,
    imageUrl: 'https://placehold.co/600x400/C4A080/FFFFFF?text=Chicha+Arroz',
    isActive: true,
    stock: 15,
    description: 'Bebida tradicional de arroz',
  },
  {
    id: '5',
    name: 'Perro Caliente',
    price: 6000,
    cost: 2500,
    imageUrl: 'https://placehold.co/600x400/CD5C5C/FFFFFF?text=Perro+Caliente',
    isActive: true,
    stock: 20,
    description: 'Perro caliente con todos los complementos',
  },
  {
    id: '6',
    name: 'Gaseosa Pepsi',
    price: 2000,
    cost: 800,
    imageUrl: 'https://placehold.co/600x400/004687/FFFFFF?text=Pepsi',
    isActive: true,
    stock: 25,
    description: 'Gaseosa Pepsi 350ml',
  },
  {
    id: '7',
    name: 'Café Tinto',
    price: 1500,
    cost: 600,
    imageUrl: 'https://placehold.co/600x400/6F4E37/FFFFFF?text=Cafe+Tinto',
    isActive: true,
    stock: 50,
    description: 'Café tinto colombiano fresquito',
  },
  {
    id: '8',
    name: 'Café con Leche',
    price: 2000,
    cost: 800,
    imageUrl: 'https://placehold.co/600x400/A0826D/FFFFFF?text=Cafe+Leche',
    isActive: true,
    stock: 40,
    description: 'Café con leche cremoso',
  },
  {
    id: '9',
    name: 'Aromática',
    price: 1500,
    cost: 600,
    imageUrl: 'https://placehold.co/600x400/8B6F47/FFFFFF?text=Aromatica',
    isActive: true,
    stock: 30,
    description: 'Té aromático surtido',
  },
  {
    id: '10',
    name: 'Agua',
    price: 1500,
    cost: 500,
    imageUrl: 'https://placehold.co/600x400/4A90E2/FFFFFF?text=Agua',
    isActive: true,
    stock: 60,
    description: 'Agua natural refrescante',
  },
];
