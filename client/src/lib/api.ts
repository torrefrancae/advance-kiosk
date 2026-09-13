export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price_cents: number;
  tag: string;
  color: string;
};

export type OrderLine = {
  id: string;
  name: string;
  qty: number;
  unit_cents: number;
  line_cents: number;
};

export type OrderStatus = 'queued' | 'preparing' | 'ready' | 'completed';

export type Order = {
  id: number;
  code: string;
  customer_name: string;
  status: OrderStatus;
  items: OrderLine[];
  total_cents: number;
  source: string;
  created_at?: string | null;
  ready_at?: string | null;
  completed_at?: string | null;
};

export const API_BASE = '/sample/advance-kiosk/api';

export function pesos(cents: number): string {
  return `PHP ${(cents / 100).toFixed(2)}`;
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  }
  return data;
}

export async function fetchMenu(): Promise<MenuItem[]> {
  const data = await parseJson<{ items: MenuItem[] }>(await fetch(`${API_BASE}/menu`));
  return data.items;
}

export async function fetchOrders(active = true): Promise<Order[]> {
  const q = active ? '?active=1' : '?active=0';
  const data = await parseJson<{ orders: Order[] }>(await fetch(`${API_BASE}/orders${q}`));
  return data.orders;
}

export async function createOrder(input: {
  customer_name: string;
  items: { id: string; qty: number }[];
}): Promise<Order> {
  const data = await parseJson<{ order: Order }>(
    await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(input),
    })
  );
  return data.order;
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const data = await parseJson<{ order: Order }>(
    await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ status }),
    })
  );
  return data.order;
}
