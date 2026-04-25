import { ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL || "";

if (!convexUrl) {
  console.warn("VITE_CONVEX_URL is not defined. Convex will not work properly.");
}

export const convex = new ConvexReactClient(convexUrl);
