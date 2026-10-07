import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Product } from '@/types/product';

type Props = {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <View className="bg-white border border-[#DCE5E2] rounded-xl p-4 mb-3">
      <View className="flex-row items-start justify-between">
        <Text className="text-[#16332E] font-bold text-base flex-1 mr-3">
          {product.name}
        </Text>
        <View
          className={`rounded-full px-2 py-1 ${
            product.active ? 'bg-[#E0EFEB]' : 'bg-[#F1F1F1]'
          }`}>
          <Text
            className={`text-xs font-bold ${
              product.active ? 'text-[#145F52]' : 'text-[#70817D]'
            }`}>
            {product.active ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>

      {product.description ? (
        <Text className="text-[#70817D] text-sm mt-1">{product.description}</Text>
      ) : null}

      <Text className="text-[#16332E] font-bold mt-2">
        ${Number(product.price).toLocaleString('es-AR')}
      </Text>
      <Text className="text-[#70817D] text-sm mt-1">Stock: {product.stock}</Text>

      {confirming ? (
        <View className="flex-row items-center mt-4">
          <Text className="text-[#A93E2B] text-sm font-bold flex-1">
            ¿Eliminar este producto?
          </Text>
          <TouchableOpacity
            onPress={() => setConfirming(false)}
            className="px-3 py-2 mr-2">
            <Text className="text-[#70817D] font-bold">Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setConfirming(false);
              onDelete(product);
            }}
            className="bg-[#A93E2B] rounded-lg px-3 py-2">
            <Text className="text-white font-bold">Sí, eliminar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row mt-4">
          <TouchableOpacity
            onPress={() => onEdit(product)}
            className="border border-[#145F52] rounded-lg px-4 py-2 mr-2">
            <Text className="text-[#145F52] font-bold">Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setConfirming(true)}
            className="border border-[#F5C8BE] rounded-lg px-4 py-2">
            <Text className="text-[#A93E2B] font-bold">Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}