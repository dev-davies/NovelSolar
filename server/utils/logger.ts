// Logger utility for centralized structured logging
// Provides consistent logging across client and server with proper levels

export class Logger {
  private static instance: Logger;
  private readonly isServer: boolean;
  private readonly isDev: boolean;

  private constructor() {
    // Detect if we're on server or client
    this.isServer = typeof window === 'undefined';
    // Check if we're in development mode
    this.isDev = this.isServer 
      ? process.env.NODE_ENV === 'development' 
      : import.meta.env?.DEV || false;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(context: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] ${context}`;
    
    if (!meta) return `${prefix} ${message}`;
    
    try {
      const metaStr = JSON.stringify(meta);
      return `${prefix} ${message} ${metaStr}`;
    } catch (e) {
      return `${prefix} ${message} ${String(meta)}`;
    }
  }

  debug(context: string, message: string, meta?: any): void {
    if (!this.isDev) return;
    console.debug(this.formatMessage(context, message, meta));
  }

  info(context: string, message: string, meta?: any): void {
    console.info(this.formatMessage(context, message, meta));
  }

  warn(context: string, message: string, meta?: any): void {
    console.warn(this.formatMessage(context, message, meta));
  }

  error(context: string, message: string, meta?: any): void {
    console.error(this.formatMessage(context, message, meta));
  }
}

// Create and export a singleton instance
export const logger = Logger.getInstance();

// Helper functions for easier usage
export function logDebug(context: string, message: string, meta?: any) {
  logger.debug(context, message, meta);
}

export function logInfo(context: string, message: string, meta?: any) {
  logger.info(context, message, meta);
}

export function logWarn(context: string, message: string, meta?: any) {
  logger.warn(context, message, meta);
}

export function logError(context: string, message: string, meta?: any) {
  logger.error(context, message, meta);
}