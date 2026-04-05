import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server.ts',
    react: 'src/components/index.ts',
    'adapters/in-memory': 'src/adapters/in-memory.ts',
    'adapters/supabase': 'src/adapters/supabase.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: false,
  clean: true,
});
