import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Presupuesto publicado como página estática (public/presupuesto.html)
  async rewrites() {
    return [{ source: "/presupuesto", destination: "/presupuesto.html" }];
  },
};

export default nextConfig;
