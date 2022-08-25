# vite-plugin-file-list

Lists all file directories and files under the current project, Useful for multi-page applications.

## Install

```sh
npm i vite-plugin-file-list -D
```

## Usage

```js
import fileList from 'vite-plugin-file-list';

export default {
    plugins: [fileList()]
};
```

## Options

```js
interface Options {
    /**
     * ignore path
     * @default [/^\.|node_modules/]
     */
    ignorePath?: RegExp[];
}
```
