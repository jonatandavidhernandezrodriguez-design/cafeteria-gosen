'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, Button, Input } from '@/app/components/ui';
import { Product } from '@/app/types/menu';

interface ProductFormProps {
  product?: Product;
  onSubmit: (formData: FormData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  price: string;
  cost: string;
  imageUrl: string;
  isActive: boolean;
  description: string;
  category: string;
  stock: string;
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: product?.name || '',
    price: product?.price.toString() || '',
    cost: product?.cost.toString() || '',
    imageUrl: product?.imageUrl || '',
    isActive: product?.isActive ?? true,
    description: product?.description || '',
    category: product?.category || '',
    stock: product?.stock?.toString() || '',
  });

  const [preview, setPreview] = useState<string>(product?.imageUrl || '');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          imageUrl: 'Formato no soportado. Usa JPEG, PNG, WebP o SVG',
        }));
        return;
      }
      
      // Validar tamaño físico (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          imageUrl: 'Archivo muy grande. Máximo 2MB',
        }));
        return;
      }
      
      // Para PNG, redimensionar la imagen
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement('img') as HTMLImageElement;
          img.onload = () => {
            // Crear canvas y redimensionar
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            
            // Limitar a 300px de ancho máximo
            if (width > 300) {
              height = Math.round((height * 300) / width);
              width = 300;
            }
            
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              
              // Convertir a data URL con compresión
              const quality = file.type === 'image/png' ? 0.8 : 0.85;
              const dataUrl = canvas.toDataURL('image/jpeg', quality);
              
              // Validar tamaño del data URL (máximo 50KB)
              if (dataUrl.length > 50 * 1024) {
                setErrors(prev => ({
                  ...prev,
                  imageUrl: 'Imagen muy pesada. Se comprimió pero sigue siendo grande. Usa una imagen más pequeña o de menor resolución.',
                }));
                return;
              }
              
              setPreview(dataUrl);
              setFormData(prev => ({
                ...prev,
                imageUrl: dataUrl,
              }));
              setErrors(prev => ({
                ...prev,
                imageUrl: undefined,
              }));
            }
          };
          img.onerror = () => {
            setErrors(prev => ({
              ...prev,
              imageUrl: 'Error al procesar la imagen.',
            }));
          };
          img.src = event.target?.result as string;
        };
        reader.onerror = () => {
          setErrors(prev => ({
            ...prev,
            imageUrl: 'Error al leer la imagen. Intenta otra.',
          }));
        };
        reader.readAsDataURL(file);
      } else {
        // Para SVG y WebP, procesar directamente
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          
          // Validar que el data URL no sea muy grande (máximo 50KB en base64)
          if (dataUrl.length > 50 * 1024) {
            setErrors(prev => ({
              ...prev,
              imageUrl: 'Imagen muy pesada. Usa una imagen más pequeña.',
            }));
            return;
          }
          
          setPreview(dataUrl);
          setFormData(prev => ({
            ...prev,
            imageUrl: dataUrl,
          }));
          setErrors(prev => ({
            ...prev,
            imageUrl: undefined,
          }));
        };
        
        reader.onerror = () => {
          setErrors(prev => ({
            ...prev,
            imageUrl: 'Error al leer la imagen.',
          }));
        };
        
        reader.readAsDataURL(file);
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'El precio debe ser mayor a 0';
    if (formData.cost && parseFloat(formData.cost) < 0) newErrors.cost = 'El costo no puede ser negativo';
    if (formData.stock && parseInt(formData.stock) < 0) newErrors.stock = 'El stock no puede ser negativo';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario */}
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <Input
              label="Nombre del Producto"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej: Café Americano"
              error={!!errors.name}
              helperText={errors.name}
            />

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descripción del producto"
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-200"
              >
                <option value="">Selecciona una categoría</option>
                <option value="coffee">Café</option>
                <option value="pastries">Pasteles</option>
                <option value="sandwiches">Sándwiches</option>
                <option value="beverages">Bebidas</option>
              </select>
            </div>

            {/* Precios */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Precio de Venta"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                error={!!errors.price}
                helperText={errors.price}
              />
              <Input
                label="Costo"
                name="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
                error={!!errors.cost}
                helperText={errors.cost}
              />
            </div>

            {/* Stock */}
            <Input
              label="Stock / Cantidad"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              error={!!errors.stock}
              helperText={errors.stock || 'Cantidad disponible de este producto'}
            />

            {/* Imagen */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Imagen del Producto
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-primary-300 bg-primary-50 text-center cursor-pointer hover:border-primary-600 hover:bg-primary-100 transition-all">
                  <p className="text-sm font-medium text-primary-600">
                    📷 Selecciona una imagen o arrastra una
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    PNG, JPG, WebP (máximo 5MB)
                  </p>
                </div>
              </div>
              {formData.imageUrl && (
                <p className="text-xs text-green-600 mt-2">✓ Imagen seleccionada</p>
              )}
            </div>

            {/* Estado */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-2 focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Producto Activo
              </label>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-6 border-t border-gray-100">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1 bg-blue-600 text-white hover:bg-blue-700 rounded-xl px-6 py-3 shadow-md font-semibold"
                disabled={isLoading}
                isLoading={isLoading}
              >
                {product ? 'Guardar Cambios' : 'Guardar Producto'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Vista previa */}
        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vista Previa
          </h3>

          {preview ? (
            <div className="relative w-full aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
                onError={() => setPreview('')}
              />
            </div>
          ) : (
            <div className="w-full aspect-square mb-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl mb-2 block">🖼️</span>
                <p className="text-sm text-gray-600">Sin imagen</p>
              </div>
            </div>
          )}

          {/* Información del producto */}
          <div className="space-y-4">
            {formData.name && (
              <>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Nombre</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formData.name}
                  </p>
                </div>
              </>
            )}

            {formData.price && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Precio</p>
                <p className="text-2xl font-bold text-primary-600">
                  ${parseFloat(formData.price).toFixed(2)}
                </p>
              </div>
            )}

            {formData.price && formData.cost && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Margen</p>
                <p className="text-sm font-semibold text-gray-700">
                  {(((parseFloat(formData.price) - parseFloat(formData.cost)) / parseFloat(formData.price)) * 100).toFixed(0)}%
                </p>
              </div>
            )}

            {formData.category && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Categoría</p>
                <p className="text-sm font-medium text-gray-700 capitalize">
                  {formData.category}
                </p>
              </div>
            )}

            {formData.stock && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Stock</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formData.stock} unidades
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                <p className="text-sm font-medium text-gray-700">
                  {formData.isActive ? 'Activo' : 'Inactivo'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

ProductForm.displayName = 'ProductForm';
