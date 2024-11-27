export interface Client {
  id: string;
  name: string;
  key: string;
  active: boolean;
  lock: Date | null;   
}