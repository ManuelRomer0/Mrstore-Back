import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  private _storage = localStorage;

  // Obtener un valor del storage
  get<T>(key: string): T | null {
    const value = this._storage.getItem(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  // Guardar un valor en el storage
  set<T>(key: string, value: T): void {
    this._storage.setItem(key, JSON.stringify(value));
  }

  // Eliminar un valor del storage
  remove(key: string): void {
    this._storage.removeItem(key);
  }

  // Limpiar todo el storage
  clear(): void {
    this._storage.clear();
  }
}
