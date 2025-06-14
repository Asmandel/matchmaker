// src/types/next-metadata-fix.d.ts

declare module 'next/dist/lib/metadata/types/metadata-interface.js' {
  export type ResolvingMetadata = Record<string, unknown>;
  export type ResolvingViewport = Record<string, unknown>;
}
