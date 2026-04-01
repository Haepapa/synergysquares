import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Play",
  description: "Create and play custom multiplayer Bingo games with Synergy Squares.",
};

export default function PlayLayout({ children }: { children: ReactNode }) {
  return children;
}
