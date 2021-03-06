/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import json from '@rollup/plugin-json';
import typescriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import pkg from './package.json';

const deps = Object.keys(
  Object.assign({}, pkg.peerDependencies, pkg.dependencies)
);

/**
 * ES5 Builds
 */
export function getEs5Builds(additionalTypescriptPlugins = {}) {
  const es5BuildPlugins = [
    typescriptPlugin({
      typescript,
      abortOnError: false,
      ...additionalTypescriptPlugins
    }),
    json()
  ];
  return [
    /**
     * Browser Builds
     */
    {
      input: 'src/index.ts',
      output: [{ file: pkg.module, format: 'es', sourcemap: true }],
      plugins: es5BuildPlugins,
      external: id => deps.some(dep => id === dep || id.startsWith(`${dep}/`))
    },
    /**
     * Node.js Build
     */
    {
      input: 'src/index.node.ts',
      output: [{ file: pkg.main, format: 'cjs', sourcemap: true }],
      plugins: es5BuildPlugins,
      external: id => deps.some(dep => id === dep || id.startsWith(`${dep}/`))
    }
  ];
}

/**
 * ES2017 Builds
 */
export function getEs2017Builds(additionalTypescriptPlugins = {}) {
  const es2017BuildPlugins = [
    typescriptPlugin({
      typescript,
      abortOnError: false,
      tsconfigOverride: {
        compilerOptions: {
          target: 'es2017'
        }
      },
      ...additionalTypescriptPlugins
    }),
    json({ preferConst: true })
  ];
  return [
    {
      /**
       * Browser Build
       */
      input: 'src/index.ts',
      output: {
        file: pkg.esm2017,
        format: 'es',
        sourcemap: true
      },
      plugins: es2017BuildPlugins,
      external: id => deps.some(dep => id === dep || id.startsWith(`${dep}/`))
    }
  ];
}

export function getAllBuilds(additionalTypescriptPlugins = {}) {
  return [
    ...getEs5Builds(additionalTypescriptPlugins),
    ...getEs2017Builds(additionalTypescriptPlugins)
  ];
}
