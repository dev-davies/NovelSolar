// Bitrix CRM API Types

export interface BitrixResponse<T> {
  result?: T;
  error?: string | boolean;
  error_description?: string;
  time?: {
    elapsed: number;
  };
}

export interface BitrixLeadResponse {
  result: number | string;
  error?: string | boolean;
  error_description?: string;
}

export interface BitrixContactResponse {
  result: number | string;
  error?: string | boolean;
  error_description?: string;
}

export interface BitrixProductResponse {
  result: {
    ID: number | string;
    ACTIVE: string;
    NAME: string;
    PRICE: string | number;
    PROPERTY_102?: any; // Cloudinary URL or similar
    PROPERTY_44?: any;  // Preview picture
    PREVIEW_PICTURE?: any;
    DETAIL_PICTURE?: any;
    [key: string]: any;
  };
  error?: string | boolean;
  error_description?: string;
}

export interface BitrixProductListResponse {
  result: {
    total?: number;
    items: Array<{
      ID: number | string;
      ACTIVE: string;
      NAME: string;
      PRICE: string | number;
      PROPERTY_102?: any;
      PROPERTY_44?: any;
      PREVIEW_PICTURE?: any;
      DETAIL_PICTURE?: any;
      [key: string]: any;
    }>;
    next?: number;
  };
  error?: string | boolean;
  error_description?: string;
}

// Bitrix Auth Types
export interface BitrixTokenRefreshResponse {
  access_token: string;
  expires_in: number;
  client_endpoint: string;
  refresh_token: string;
  domain: string;
  server_endpoint: string;
}

// Bitrix Context Types (moved from bitrixAuth.ts)
export interface BitrixContext {
  baseUrl: string;
  authId?: string;
  domain?: string;
}