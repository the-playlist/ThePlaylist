module.exports = {
  webpack(config) {
    config.resolve.alias["~"] = path.resolve(__dirname);
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|woff|woff2|otf|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 8192,
          },
        },
      ],
    });
    return config;
  },
};
