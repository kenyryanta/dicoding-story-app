const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/scripts/app.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.[contenthash].js",
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "images/[name][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html",
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: "src/manifest.webmanifest", to: "manifest.webmanifest" },
          { from: "src/icons", to: "icons" },
          { from: "src/screenshots", to: "screenshots" },
        ],
      }),
      // Hanya gunakan InjectManifest di production mode
      ...(isProduction
        ? [
            new InjectManifest({
              swSrc: "./src/sw.js",
              swDest: "sw.js",
              exclude: [/\.map$/, /manifest$/, /\.htaccess$/],
              maximumFileSizeToCacheInBytes: 5000000,
            }),
          ]
        : []),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      compress: true,
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
    },
  };
};
