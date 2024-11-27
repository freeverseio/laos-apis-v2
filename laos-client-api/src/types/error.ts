export type ErrorType = 'error' | 'warning' | 'info';

export interface SerializableError {
  message: string;
  field?: string; 
}

export type AppError = SerializableError & {
  type?: ErrorType;
};