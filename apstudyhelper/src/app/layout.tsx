"use client";

import { ColorModeProvider } from "@/components/ui/color-mode";
import {
  ChakraProvider,
  defaultSystem,
  defineConfig,
  createSystem,
} from "@chakra-ui/react";
import { ColorModeButton } from "@/components/ui/color-mode";

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider>
            {" "}
            {/* <ColorModeButton /> */}
            {children}
          </ColorModeProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
