import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productService, CreateProductData, UpdateProductData, AddProductVariantsRequest } from '../../services/productService.ts';

// Define types for the product state
interface ProductAllocation {
  productId: string;
  storeIds: string[];
  success?: boolean;
  error?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  product_image: string | null;
  category: string | null;
  pack_quantity: number;
  total_packs: number;
  available_packs: number;
  created_at: string;
  company_id: number;
  suitable_for: string;
  size: string;
  price_of_pack: number;
  is_active: boolean;
  updated_at: string;
  linked_products?: Array<{
    size: string;
    linked_product_id?: number;
  }>;
}

interface ProductState {
  products: {
    products: Product[];
  };
  currentProduct: {
    product: Product;
  } | null;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  allocationSuccess: boolean;
  linkSuccess: boolean;
  variantSuccess: boolean;
  allocations: ProductAllocation[];
  allocatedStores: string[];
}

// Initial state
const initialState: ProductState = {
  products: {
    products: []
  },
  currentProduct: null,
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  allocationSuccess: false,
  linkSuccess: false,
  variantSuccess: false,
  allocations: [],
  allocatedStores: [],
};

// Create async thunks for API calls
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async ({ dnsPrefix, data }: { dnsPrefix: string; data: CreateProductData }, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(dnsPrefix, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  'product/fetchAllProducts',
  async (dnsPrefix: string, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts(dnsPrefix);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const getProductById = createAsyncThunk(
  'product/getProductById',
  async ({ dnsPrefix, productId }: { dnsPrefix: string; productId: string }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(dnsPrefix, productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ dnsPrefix, productId, data }: { dnsPrefix: string; productId: string; data: UpdateProductData | FormData }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(dnsPrefix, productId, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async ({ dnsPrefix, productId }: { dnsPrefix: string; productId: string }, { rejectWithValue }) => {
    try {
      const response = await productService.deleteProduct(dnsPrefix, productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const getProductsByStoreId = createAsyncThunk(
  'product/getProductsByStoreId',
  async ({ dnsPrefix, storeId }: { dnsPrefix: string; storeId: string }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductsByStoreId(dnsPrefix, storeId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch store products');
    }
  }
);

export const getAllocatedStores = createAsyncThunk(
  'product/getAllocatedStores',
  async ({ dnsPrefix, productId }: { dnsPrefix: string; productId: string }, { rejectWithValue }) => {
    try {
      const response = await productService.getAllocatedStoresForProduct(dnsPrefix, productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch allocated stores');
    }
  }
);

export const allocateProductToStores = createAsyncThunk(
  'product/allocateProductToStores',
  async ({ 
    dnsPrefix, 
    productId, 
    storeIds 
  }: { 
    dnsPrefix: string; 
    productId: string; 
    storeIds: string[] 
  }, { rejectWithValue }) => {
    try {
      const response = await productService.allocateProductToStores(dnsPrefix, productId, storeIds);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to allocate product to stores');
    }
  }
);

export const linkProducts = createAsyncThunk(
  'product/linkProducts',
  async ({ dnsPrefix, productIds }: { dnsPrefix: string; productIds: string[] }, { rejectWithValue }) => {
    try {
      const response = await productService.linkProducts(dnsPrefix, productIds);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to link products');
    }
  }
);

export const addProductVariants = createAsyncThunk(
  'product/addProductVariants',
  async ({ 
    dnsPrefix, 
    productId, 
    variants 
  }: { 
    dnsPrefix: string; 
    productId: string; 
    variants: AddProductVariantsRequest 
  }, { rejectWithValue }) => {
    try {
      const response = await productService.addProductVariants(dnsPrefix, productId, variants);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product variants');
    }
  }
);

export const allocateMultipleProductsToStores = createAsyncThunk(
  'product/allocateMultipleProductsToStores',
  async ({ 
    dnsPrefix, 
    storeIds,
    productIds 
  }: { 
    dnsPrefix: string; 
    storeIds: string[];
    productIds: string[];
  }, { rejectWithValue }) => {
    try {
      const response = await productService.allocateMultipleProductsToStores(dnsPrefix, storeIds, productIds);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to allocate multiple products to stores');
    }
  }
);

// Create the product slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.allocationSuccess = false;
      state.linkSuccess = false;
      state.variantSuccess = false;
      state.allocations = [];
    },
    decrementStock: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      if (state.products.products) {
        const product = state.products.products.find(p => p.id === productId);
        if (product && product.available_packs >= quantity) {
          product.available_packs -= quantity;
        }
      }
    },
    incrementStock: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      if (state.products.products) {
        const product = state.products.products.find(p => p.id === productId);
        if (product) {
          product.available_packs += quantity;
        }
      }
    },
    updateStock: (state, action: PayloadAction<{ productId: number; newStock: number }>) => {
      const { productId, newStock } = action.payload;
      if (state.products.products) {
        const product = state.products.products.find(p => p.id === productId);
        if (product) {
          product.available_packs = newStock;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create product cases
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.createSuccess = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.createSuccess = false;
      })
      // Fetch all products cases
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get product by ID cases
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update product cases
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
        state.updateSuccess = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      })
      // Delete product cases
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        // Remove the deleted product from the products array
        if (state.products.products) {
          state.products.products = state.products.products.filter(
            (product) => product.id !== parseInt(action.meta.arg.productId)
          );
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.deleteSuccess = false;
      })
      // Get products by store ID cases
      .addCase(getProductsByStoreId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsByStoreId.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProductsByStoreId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Allocate product to stores cases
      .addCase(allocateProductToStores.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.allocationSuccess = false;
      })
      .addCase(allocateProductToStores.fulfilled, (state, action) => {
        state.loading = false;
        state.allocationSuccess = true;
        // Add the successful allocation to the allocations array
        state.allocations.push({
          productId: action.meta.arg.productId,
          storeIds: action.meta.arg.storeIds,
          success: true
        });
      })
      .addCase(allocateProductToStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.allocationSuccess = false;
        // Add the failed allocation to the allocations array
        state.allocations.push({
          productId: action.meta.arg.productId,
          storeIds: action.meta.arg.storeIds,
          success: false,
          error: action.payload as string
        });
      })
      // Get allocated stores cases
      .addCase(getAllocatedStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllocatedStores.fulfilled, (state, action) => {
        state.loading = false;
        state.allocatedStores = action.payload;
      })
      .addCase(getAllocatedStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Link products cases
      .addCase(linkProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.linkSuccess = false;
      })
      .addCase(linkProducts.fulfilled, (state) => {
        state.loading = false;
        state.linkSuccess = true;
      })
      .addCase(linkProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.linkSuccess = false;
      })
      // Add product variants cases
      .addCase(addProductVariants.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.variantSuccess = false;
      })
      .addCase(addProductVariants.fulfilled, (state, action) => {
        state.loading = false;
        state.variantSuccess = true;
      })
      .addCase(addProductVariants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.variantSuccess = false;
      })
      // Allocate multiple products to stores cases
      .addCase(allocateMultipleProductsToStores.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.allocationSuccess = false;
      })
      .addCase(allocateMultipleProductsToStores.fulfilled, (state) => {
        state.loading = false;
        state.allocationSuccess = true;
      })
      .addCase(allocateMultipleProductsToStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.allocationSuccess = false;
      });
  },
});

export const { 
  resetState, 
  decrementStock, 
  incrementStock, 
  updateStock 
} = productSlice.actions;
export default productSlice.reducer;
export type { Product, ProductState, ProductAllocation };
