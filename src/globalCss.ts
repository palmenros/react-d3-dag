// Importing CSS files globally (e.g. `import "./styles.css"`) can cause resolution issues with certain
// libraries/frameworks.
// Example: Next.js (https://github.com/vercel/next.js/blob/master/errors/css-npm.md)
//
// Since rd3dag's CSS is bare bones to begin with, we provide all required styles as a template string,
// which can be imported like any other TS/JS module and inlined into a `<style></style>` tag.

export default `
/* Tree */
.rd3dag-tree-container {
  width: 100%;
  height: 100%;
}

.rd3dag-grabbable {
  cursor: move; /* fallback if grab cursor is unsupported */
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}
.rd3dag-grabbable:active {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
}

/* Node */
.rd3dag-node {
  cursor: pointer;
  fill: #777;
  stroke: #000;
  stroke-width: 2;
}

.rd3dag-leaf-node {
  cursor: pointer;
  fill: transparent;
  stroke: #000;
  stroke-width: 2;
}

.rd3dag-label__title {
  stroke: #000;
  stroke-width: 1;
}

.rd3dag-label__attributes {
  stroke: #777;
  stroke-width: 1;
  font-size: smaller;
}

/* Link */
.rd3dag-link {
  fill: none;
  stroke: #000;
}
`;
