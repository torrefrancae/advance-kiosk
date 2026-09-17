export type MenuItem = {
  id: string;
  name: string;
  category: string;
  price_cents: number;
  tag: string;
  color: string;
  image?: string;
};

export type OrderLine = {
  id: string;
  name: string;
  qty: number;
  unit_cents: number;
  line_cents: number;
  image?: string;
};

export type OrderStatus = 'queued' | 'paid' | 'preparing' | 'ready' | 'completed';

export type Order = {
  id: number;
  code: string;
  customer_name: string;
  status: OrderStatus;
  items: OrderLine[];
  total_cents: number;
  source: string;
  created_at?: string | null;
  paid_at?: string | null;
  preparing_at?: string | null;
  ready_at?: string | null;
  completed_at?: string | null;
};

export const API_BASE = '/sample/advance-kiosk/api';

export function pesos(cents: number): string {
  const n = Number(cents);
  if (!Number.isFinite(n)) return 'PHP 0.00';
  return `PHP ${(n / 100).toFixed(2)}`;
}

export function statusLabel(status: OrderStatus): string {
  switch (status) {
    case 'queued':
      return 'Awaiting payment';
    case 'paid':
      return 'Paid - waiting cook';
    case 'preparing':
      return 'Cooking started';
    case 'ready':
      return 'Ready for pickup';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
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
  return data.items.map((item) => ({
    ...item,
    price_cents: Number(item.price_cents) || 0,
  }));
}

export async function fetchOrders(active = true): Promise<Order[]> {
  const q = active ? '?active=1' : '?active=0';
  const data = await parseJson<{ orders: Order[] }>(await fetch(`${API_BASE}/orders${q}`));
  return data.orders.map((order) => ({
    ...order,
    total_cents: Number(order.total_cents) || 0,
  }));
}

export async function createOrder(input: {
  customer_name: string;
  items: { id: string; qty: number }[];
  source?: string;
}): Promise<Order> {
  const data = await parseJson<{ order: Order }>(
    await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(input),
    })
  );
  return { ...data.order, total_cents: Number(data.order.total_cents) || 0 };
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  return updateOrder(id, { status });
}

export async function updateOrder(
  id: number,
  patch: {
    status?: OrderStatus;
    customer_name?: string;
    items?: { id: string; qty: number }[];
  }
): Promise<Order> {
  const data = await parseJson<{ order: Order }>(
    await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(patch),
    })
  );
  return { ...data.order, total_cents: Number(data.order.total_cents) || 0 };
}
