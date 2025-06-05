const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const publicPath = isProduction ? "/dicoding-story-app/" : "/";

  return {
    entry: "./src/scripts/app.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.[contenthash].js",
      publicPath: publicPath,
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
            filename: (pathData) => {
              // Preserve folder structure for icons and screenshots
              const relativePath = path.relative("src", pathData.filename);
              return relativePath;
            },
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
          {
            from: "src/icons",
            to: "icons",
            noErrorOnMissing: true,
          },
          {
            from: "src/screenshots",
            to: "screenshots",
            noErrorOnMissing: true,
          },
          { from: "src/sw.js", to: "sw.js" },
        ],
      }),
      ...(isProduction
        ? [
            new InjectManifest({
              swSrc: "./src/sw.js",
              swDest: "sw.js",
              exclude: [/\.map$/, /manifest$/, /\.htaccess$/],
            }),
          ]
        : []),
    ],
    devServer: {
      static: [
        {
          directory: path.join(__dirname, "dist"),
        },
        {
          directory: path.join(__dirname, "src"),
          publicPath: "/",
        },
      ],
      compress: true,
      port: 3000,
      open: true,
      hot: true,
      historyApiFallback: true,
      setupMiddlewares: (middlewares, devServer) => {
        // Serve sw.js
        devServer.app.get("/sw.js", (req, res) => {
          res.setHeader("Content-Type", "application/javascript");
          res.sendFile(path.resolve(__dirname, "src/sw.js"));
        });
        return middlewares;
      },
    },
  };
};
