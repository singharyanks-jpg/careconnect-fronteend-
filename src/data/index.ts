import type { IDataAdapter } from './adapterInterface';
import { mockAdapter } from './mockAdapter';
import { supabaseAdapter } from './supabaseAdapter';

const selectedAdapterName = import.meta.env.VITE_DATA_ADAPTER;

export const dataAdapter: IDataAdapter = 
  selectedAdapterName === 'supabase' ? supabaseAdapter : mockAdapter;

export * from './types';
export * from './adapterInterface';
