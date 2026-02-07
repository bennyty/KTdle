import type { NextConfig } from "next";
import pkg from './package.json';
import child_process from 'child_process';

// Get the git hash
const commitHash = child_process
  .execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/KTdle",
  env: {
    // add the package.json version and git hash to the environment
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash
  }
};

export default nextConfig;
