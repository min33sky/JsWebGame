const path = require('path');
const webpack = require('webpack');

module.exports = {
  name: 'gugudan-setting',
  mode: 'development',
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.jsx'],
  },

  entry: {
    app: ['./client'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        options: {
          // presets: plugins들을 모아서 하나로 만들어 놓은 것
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: ['> 1% in KR'], // browser_list
                },
                debug: true,
              },
            ],
            '@babel/preset-react',
          ],
          plugins: ['@babel/plugin-proposal-class-properties'],
        },
      },
    ],
  },

  plugins: [new webpack.LoaderOptionsPlugin({ debug: true })], // 위 module의 options에 debug를 추가해준다

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
  },
};
