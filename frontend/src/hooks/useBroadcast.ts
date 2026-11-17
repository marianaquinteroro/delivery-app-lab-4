"use client";

import { supabase } from "@/src/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

type BroadcastHandlers = Record<string, (payload: unknown) => void>;

export const useBroadcast = (
  channelName: string | null,
  handlers: BroadcastHandlers,
) => {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  const events = Object.keys(handlers).join(",");

  useEffect(() => {
    if (!channelName) return;

    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    const subscribe = async () => {
      const topic = `realtime:${channelName}`;
      const previous = supabase.getChannels().filter((c) => c.topic === topic);
      await Promise.all(previous.map((c) => supabase.removeChannel(c)));

      if (cancelled) return;

      channel = supabase.channel(channelName);

      for (const event of events.split(",").filter(Boolean)) {
        channel.on("broadcast", { event }, ({ payload }) => {
          handlersRef.current[event]?.(payload);
        });
      }

      channel.subscribe((status, error) => {
        if (status === "SUBSCRIBED") {
          console.log(`Conectado en tiempo real (${channelName})`);
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error(
            `Error en la conexion en tiempo real (${channelName} - ${status})`,
            error,
          );
        }
      });
    };

    subscribe();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [channelName, events]);
};
