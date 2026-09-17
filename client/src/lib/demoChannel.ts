export const DEMO_CHANNEL = 'beejoy-demo';

export const DEMO_ITEMS = [
  { id: 'chicken-joy-meal', qty: 1 },
  { id: 'peach-mango-pie', qty: 1 },
  { id: 'float', qty: 1 },
] as const;

export type DemoChannelMessage =
  | { type: 'beejoy-demo-begin'; runId: string }
  | { type: 'beejoy-demo-ack'; runId: string }
  | { type: 'beejoy-demo-placed'; runId: string; order: unknown }
  | { type: 'beejoy-demo-error'; runId: string; error: string };

export function openDemoChannel() {
  return new BroadcastChannel(DEMO_CHANNEL);
}
