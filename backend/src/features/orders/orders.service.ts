import Boom from "@hapi/boom";
import { supabase } from "../../config/supabase";
import { AuthUser } from "../auth/auth.types";
import {
  acceptOrderRepository,
  createOrderRepository,
  getActiveOrderByDeliveryIdRepository,
  getAvailableOrdersRepository,
  getOrderByClientId,
  getOrderByIdRepository,
  getOrdersByStoreIdRepository,
  getStoreOwnerIdRepository,
  updateCourierLocationRepository,
} from "./orders.repository";
import {
  CreateOrderDTO,
  LatLng,
  LocationUpdatedPayload,
  Order,
} from "./orders.types";

const DELIVERY_RADIUS_METERS = 10;
const COURIER_START_OFFSET_DEGREES = 0.0016;

const broadcast = async (
  channelName: string,
  event: string,
  payload: object,
) => {
  const channel = supabase.channel(channelName);
  try {
    const result = (await channel.httpSend(event, payload)) as unknown as
      | { success?: boolean; status?: number; error?: string }
      | undefined;

    if (result && result.success === false) {
      console.error(
        `Error en el envio de "${event}", Supabase lo rechazo (${channelName})`,
        result.status,
        result.error,
      );
    }
  } catch (error) {
    console.error(
      `Error en el envio de "${event}" (${channelName})`,
      error,
    );
  } finally {
    await supabase.removeChannel(channel);
  }
};

export const broadcastToOrders = (event: string, payload: object) =>
  broadcast("orders", event, payload);

export const broadcastToOrder = (
  orderId: string,
  event: string,
  payload: object,
) => broadcast(`orders:${orderId}`, event, payload);

export const broadcastToStore = (
  storeId: string,
  event: string,
  payload: object,
) => broadcast(`stores:${storeId}`, event, payload);

export const broadcastToClient = (
  clientId: string,
  event: string,
  payload: object,
) => broadcast(`clients:${clientId}`, event, payload);

const broadcastOrderStatus = async (order: Order) => {
  await Promise.all([
    broadcastToOrders("order-status-updated", order),
    broadcastToOrder(order.id, "order-status-updated", order),
    broadcastToStore(order.store_id, "order-status-updated", order),
    broadcastToClient(order.client_id, "order-status-updated", order),
  ]);
};

export const getOrderByClientIdService = async (clientId: string) => {
  return await getOrderByClientId(clientId);
};

export const getAvailableOrdersService = async () => {
  return await getAvailableOrdersRepository();
};

export const getActiveDeliveryOrderService = async (deliveryId: string) => {
  return (await getActiveOrderByDeliveryIdRepository(deliveryId)) ?? null;
};

export const getOrdersByStoreIdService = async (
  storeId: string,
  user: AuthUser,
) => {
  const ownerId = await getStoreOwnerIdRepository(storeId);

  if (!ownerId) {
    throw Boom.notFound("Store not found");
  }
  if (ownerId !== user.id) {
    throw Boom.forbidden("This store is not yours");
  }

  return await getOrdersByStoreIdRepository(storeId);
};

export const getOrderDetailService = async (
  orderId: string,
  user: AuthUser,
) => {
  const order = await getOrderByIdRepository(orderId);

  if (!order) {
    throw Boom.notFound("Order not found");
  }

  const isClient = order.client_id === user.id;
  const isCourier = order.delivery_id === user.id;
  const isStoreOwner =
    user.role === "store" &&
    (await getStoreOwnerIdRepository(order.store_id)) === user.id;

  if (!isClient && !isCourier && !isStoreOwner) {
    throw Boom.forbidden("You can't see this order");
  }

  return order;
};

export const createOrderService = async (data: CreateOrderDTO) => {
  const { orderId, orderItems } = await createOrderRepository(data);
  const order = await getOrderByIdRepository(orderId);

  await Promise.all([
    broadcastToOrders("order-created", order),
    broadcastToStore(order.store_id, "order-created", order),
  ]);

  return { ...order, order_items: orderItems };
};

export const acceptOrderService = async (
  orderId: string,
  deliveryId: string,
) => {
  const activeOrder = await getActiveOrderByDeliveryIdRepository(deliveryId);

  if (activeOrder) {
    throw Boom.conflict("You already have an order in progress");
  }

  const accepted = await acceptOrderRepository(
    orderId,
    deliveryId,
    COURIER_START_OFFSET_DEGREES,
  );

  if (!accepted) {
    throw Boom.conflict("This order is no longer available");
  }

  const order = await getOrderByIdRepository(orderId);
  await broadcastOrderStatus(order);
  return order;
};

export const updateCourierLocationService = async (
  orderId: string,
  deliveryId: string,
  location: LatLng,
) => {
  const updated = await updateCourierLocationRepository(
    orderId,
    deliveryId,
    location,
    DELIVERY_RADIUS_METERS,
  );

  if (!updated) {
    throw Boom.conflict("Order is not in progress or is not assigned to you");
  }

  const payload: LocationUpdatedPayload = {
    orderId,
    lat: location.lat,
    lng: location.lng,
    status: updated.status,
  };
  await broadcastToOrder(orderId, "location-updated", payload);

  const order = await getOrderByIdRepository(orderId);

  if (updated.status === "delivered") {
    await broadcastOrderStatus(order);
  }

  return order;
};
