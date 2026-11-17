import Boom from "@hapi/boom";
import { Request, Response } from "express";
import { getAuthUser } from "../../middlewares/authMiddleware";
import {
  acceptOrderService,
  createOrderService,
  getActiveDeliveryOrderService,
  getAvailableOrdersService,
  getOrderByClientIdService,
  getOrderDetailService,
  getOrdersByStoreIdService,
  updateCourierLocationService,
} from "./orders.service";
import { LatLng } from "./orders.types";

const isValidLatLng = (value: unknown): value is LatLng => {
  if (typeof value !== "object" || value === null) return false;
  const { lat, lng } = value as Record<string, unknown>;
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

export const getOrdersByClientIdController = async (
  req: Request,
  res: Response,
) => {
  const user = getAuthUser(req);
  const { clientId } = req.params;

  if (String(clientId) !== user.id) {
    throw Boom.forbidden("You can only see your own orders");
  }

  const orders = await getOrderByClientIdService(String(clientId));
  res.status(200).json(orders);
};

export const getOrdersByStoreIdController = async (
  req: Request,
  res: Response,
) => {
  const user = getAuthUser(req);
  const { storeId } = req.params;
  const orders = await getOrdersByStoreIdService(String(storeId), user);
  res.status(200).json(orders);
};

export const getAvailableOrdersController = async (
  _req: Request,
  res: Response,
) => {
  const orders = await getAvailableOrdersService();
  res.status(200).json(orders);
};

export const getActiveDeliveryOrderController = async (
  req: Request,
  res: Response,
) => {
  const user = getAuthUser(req);
  const order = await getActiveDeliveryOrderService(user.id);
  res.status(200).json(order);
};

export const getOrderDetailController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { orderId } = req.params;
  const order = await getOrderDetailService(String(orderId), user);
  res.status(200).json(order);
};

export const createOrderController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { store_id, items, delivery_location } = req.body;

  if (!store_id) {
    throw Boom.badRequest("store_id is required");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw Boom.badRequest("The order must have at least one item");
  }
  if (!isValidLatLng(delivery_location)) {
    throw Boom.badRequest("delivery_location { lat, lng } is required");
  }

  const order = await createOrderService({
    user_id: user.id,
    store_id,
    items,
    delivery_location,
  });

  res.status(201).json(order);
};

export const acceptOrderController = async (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { orderId } = req.params;
  const order = await acceptOrderService(String(orderId), user.id);
  res.status(200).json(order);
};

export const updateCourierLocationController = async (
  req: Request,
  res: Response,
) => {
  const user = getAuthUser(req);
  const { orderId } = req.params;

  if (!isValidLatLng(req.body)) {
    throw Boom.badRequest("lat and lng are required");
  }

  const order = await updateCourierLocationService(String(orderId), user.id, {
    lat: req.body.lat,
    lng: req.body.lng,
  });

  res.status(200).json(order);
};
