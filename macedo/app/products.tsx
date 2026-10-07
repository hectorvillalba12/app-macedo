import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ProductCard } from '@/components/ProductCard';
import { getAccessToken } from '@/lib/session';
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from '@/services/products';
import { Product, ProductInput } from '@/types/product';

const LIMIT = 10;
const inputClass =
  'bg-white border border-[#DCE5E2] rounded-xl px-4 h-12 text-[#16332E] text-[15px] mb-3';

export default function ProductsScreen() {
  // Listado
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Formulario (crear / editar)
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  async function loadProducts(pageToLoad = page, searchToUse = appliedSearch) {
    try {
      setLoading(true);
      setError(null);
      const response = await listProducts(pageToLoad, LIMIT, searchToUse);
      setProducts(response.data);
      setTotal(response.meta.total);
      setPage(pageToLoad);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      const token = await getAccessToken();
      if (!token) {
        router.replace('/');
        return;
      }
      loadProducts(1, '');
    }
    init();
  }, []);

  function handleSearch() {
    const text = search.trim();
    setAppliedSearch(text);
    loadProducts(1, text);
  }

  function clearSearch() {
    setSearch('');
    setAppliedSearch('');
    loadProducts(1, '');
  }

  function openCreate() {
    setEditing(null);
    setName('');
    setDescription('');
    setPrice('');
    setStock('0');
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setName(product.name);
    setDescription(product.description ?? '');
    setPrice(String(Number(product.price)));
    setStock(String(product.stock));
    setFormError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setFormError(null);
  }

  async function handleSave() {
    const cleanName = name.trim();
    const cleanDescription = description.trim();
    const numericPrice = Number(price.replace(',', '.'));
    const numericStock = Number(stock);

    if (cleanName.length < 2 || cleanName.length > 160) {
      setFormError('El nombre debe tener entre 2 y 160 caracteres.');
      return;
    }
    if (cleanDescription.length > 5000) {
      setFormError('La descripción puede tener hasta 5000 caracteres.');
      return;
    }
    if (
      price.trim() === '' ||
      Number.isNaN(numericPrice) ||
      numericPrice < 0 ||
      numericPrice > 9999999999 ||
      Math.round(numericPrice * 100) !== numericPrice * 100 // más de 2 decimales
    ) {
      setFormError('Ingresá un precio válido (hasta 2 decimales).');
      return;
    }
    if (
      stock.trim() === '' ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      setFormError('El stock debe ser un entero mayor o igual a 0.');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      if (editing) {
        // PATCH: solo mandamos los campos que cambiaron
        const changes: Partial<ProductInput> = {};
        if (cleanName !== editing.name) changes.name = cleanName;
        if (cleanDescription !== (editing.description ?? ''))
          changes.description = cleanDescription;
        if (numericPrice !== Number(editing.price)) changes.price = numericPrice;
        if (numericStock !== editing.stock) changes.stock = numericStock;

        if (Object.keys(changes).length > 0) {
          await updateProduct(editing.id, changes);
        }
      } else {
        await createProduct({
          name: cleanName,
          description: cleanDescription,
          price: numericPrice,
          stock: numericStock,
        });
      }

      closeForm();
      await loadProducts(editing ? page : 1);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    try {
      setError(null);
      await deleteProduct(product.id);
      // si era el último de la página, volvemos a la anterior
      const nextPage = products.length === 1 && page > 1 ? page - 1 : page;
      await loadProducts(nextPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo eliminar.');
    }
  }

  const header = (
    <View>
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-[#145F52] font-bold">Volver</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#16332E]">Productos</Text>
        <View className="w-12" />
      </View>

      {/* Búsqueda */}
      <View className="flex-row items-center mb-4">
        <TextInput
          className="flex-1 bg-white border border-[#DCE5E2] rounded-xl px-4 h-12 text-[#16332E] text-[15px]"
          placeholder="Buscar por nombre o descripción"
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity
          onPress={handleSearch}
          className="bg-[#145F52] rounded-xl h-12 px-4 items-center justify-center ml-2">
          <Text className="text-white font-bold">Buscar</Text>
        </TouchableOpacity>
      </View>

      {appliedSearch ? (
        <TouchableOpacity onPress={clearSearch} className="mb-3">
          <Text className="text-[#145F52] text-sm font-bold">
            Resultados para "{appliedSearch}" · Limpiar búsqueda
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* Formulario */}
      {formOpen ? (
        <View className="bg-[#E9F1EF] border border-[#DCE5E2] rounded-2xl p-4 mb-5">
          <Text className="text-[#16332E] font-bold text-base mb-3">
            {editing ? 'Editar producto' : 'Nuevo producto'}
          </Text>

          <TextInput
            className={inputClass}
            placeholder="Nombre"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className={inputClass}
            placeholder="Descripción (opcional)"
            placeholderTextColor="#9ca3af"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            className={inputClass}
            placeholder="Precio"
            placeholderTextColor="#9ca3af"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
          <TextInput
            className={inputClass}
            placeholder="Stock"
            placeholderTextColor="#9ca3af"
            value={stock}
            onChangeText={setStock}
            keyboardType="number-pad"
          />

          {formError ? (
            <View className="bg-[#FFF0ED] border border-[#F5C8BE] rounded-xl px-4 py-3 mb-3">
              <Text className="text-[#A93E2B] text-sm">{formError}</Text>
            </View>
          ) : null}

          <View className="flex-row">
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              className="flex-1 bg-[#145F52] rounded-xl h-12 items-center justify-center mr-2">
              <Text className="text-white font-bold">
                {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear producto'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeForm}
              disabled={saving}
              className="bg-white border border-[#DCE5E2] rounded-xl h-12 px-4 items-center justify-center">
              <Text className="text-[#324943] font-bold">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={openCreate}
          className="bg-[#145F52] rounded-xl h-12 items-center justify-center mb-5">
          <Text className="text-white font-bold">+ Nuevo producto</Text>
        </TouchableOpacity>
      )}

      {loading ? <ActivityIndicator color="#145F52" className="mb-4" /> : null}

      {error ? (
        <View className="bg-[#FFF0ED] border border-[#F5C8BE] rounded-xl px-4 py-3 mb-4">
          <Text className="text-[#A93E2B] text-sm">{error}</Text>
          <TouchableOpacity onPress={() => loadProducts()} className="mt-2">
            <Text className="text-[#A93E2B] text-sm font-bold">Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  const footer = (
    <View className="flex-row items-center justify-between mt-2 mb-6">
      <TouchableOpacity
        disabled={page <= 1 || loading}
        onPress={() => loadProducts(page - 1)}
        className={`px-4 py-2 rounded-lg border border-[#DCE5E2] bg-white ${
          page <= 1 ? 'opacity-40' : ''
        }`}>
        <Text className="text-[#324943] font-bold">Anterior</Text>
      </TouchableOpacity>
      <Text className="text-[#70817D] text-sm">
        Página {page} de {totalPages}
      </Text>
      <TouchableOpacity
        disabled={page >= totalPages || loading}
        onPress={() => loadProducts(page + 1)}
        className={`px-4 py-2 rounded-lg border border-[#DCE5E2] bg-white ${
          page >= totalPages ? 'opacity-40' : ''
        }`}>
        <Text className="text-[#324943] font-bold">Siguiente</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7F6]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <View className="flex-1 w-full max-w-[720px] self-center px-6 py-6">
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={header}
            ListFooterComponent={total > LIMIT ? footer : null}
            ListEmptyComponent={
              !loading && !error ? (
                <Text className="text-[#70817D] text-center mt-6">
                  No hay productos.
                </Text>
              ) : null
            }
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}