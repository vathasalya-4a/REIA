/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "public.blob.vercel-storage.com" },
      { hostname: "y60keflha80zcrju.public.blob.vercel-storage.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "abs.twimg.com" },
      { hostname: "pbs.twimg.com" },
      { hostname: "avatar.vercel.sh" },
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "www.google.com" },
      { hostname: "flag.vercel.app" },
      { hostname: "illustrations.popsy.co" },
      { hostname: "api.dicebear.com" },
      { hostname: "reia-production-0908.up.railway.app" },
    ],
  },
  webpack: (config, { isServer }) => {
    // Avoid processing `canvas` with Webpack in the browser
    if (!isServer) {
      config.externals = [
        ...(config.externals || []),
        'canvas', // Add canvas to externals
      ];
    }

    // Handle `.node` files for native modules
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Additional rule to handle `.wasm` files if needed
    config.module.rules.push({
      test: /\.wasm$/,
      type: "javascript/auto",
      use: {
        loader: "file-loader",
        options: {
          publicPath: "static/",
          outputPath: "static/",
          name: "[name].[hash].[ext]",
        },
      },
    });

    // Exclude `pdf.worker.min.mjs` from Webpack bundling and serve it as a static file
    config.module.rules.push({
      test: /pdf\.worker\.min\.mjs$/,
      type: "asset/resource",
      generator: {
        filename: "static/pdf.worker.min.mjs",
      },
    });

    return config;
  },
};

module.exports = nextConfig;
