const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['shared'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
  output: 'export',
};

module.exports = nextConfig;
