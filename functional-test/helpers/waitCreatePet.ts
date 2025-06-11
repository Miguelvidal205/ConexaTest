import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function waitCreatePet<T extends { id: number, name: string; }>(
  pet: T,
  options?: {
    retries?: number;
    interval?: number;
    log?: boolean;
  }
): Promise<AxiosResponse<T>> {
  const {
    retries = 5,
    interval = 1000,
    log = false
  } = options || {};

  // 1. POST /pet
  const postRes = await apiClient.post<T>('/pet', pet);
  if (log) console.log(`[waitCreatePet] 🐶 Pet created with ID ${pet.id}`);
  if (postRes.status < 200 || postRes.status >= 300) {
    throw new Error(`Error al crear ${postRes.status}`);
  }

  // 2. Retry GET /pet/{id} to confirm it's available
  for (let i = 0; i < retries; i++) {
    try {
      const getRes = await apiClient.get<T>(`/pet/${pet.id}`);
      if (getRes.status === 200 && getRes.data.name === pet.name) {
        if (log) console.log(`Si se creo ${i + 1}`);
        return getRes;
      }
    } catch (err) {
      if (log) console.warn(`Fallo la creacion en el intento -> ${i + 1} failed. Pet not found yet.`);
    }

    if (i < retries - 1) {
      if (log) console.log(`Estoy esperando ${interval}ms...`);
      await delay(interval);
    }
  }

  throw new Error(`No se pudo crear con el ID ${pet.id}`);
}
