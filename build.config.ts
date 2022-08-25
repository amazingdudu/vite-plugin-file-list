// eslint-disable-next-line import/no-unresolved
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    entries: ['src/index'],
    externals: ['vite'],
    clean: true,
    declaration: true,
    rollup: {
        emitCJS: true,
        inlineDependencies: true
    }
});
