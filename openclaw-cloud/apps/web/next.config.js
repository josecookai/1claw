const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['shared'],
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

module.exports = nextConfig;
