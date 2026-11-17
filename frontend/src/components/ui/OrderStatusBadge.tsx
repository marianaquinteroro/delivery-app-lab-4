import { OrderStatus } from "@/src/types/orders.types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> =
  {
    waiting_for_delivery: {
      label: "Created",
      className: "bg-gray-100 text-gray-700 border-gray-300",
    },
    in_progress: {
      label: "On the way",
      className: "bg-amber-100 text-amber-800 border-amber-300",
    },
    delivered: {
      label: "Delivered",
      className: "bg-green-100 text-green-800 border-green-300",
    },
  };

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.waiting_for_delivery;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
};
