<h1 align="center">React D3 DAG</h1>

<p align="center">
  <a href="#buildstatus">
    <img alt="build status" src="https://github.com/forivall/react-d3-dag/workflows/Build/badge.svg">
  </a>
  <a href="https://coveralls.io/github/forivall/react-d3-dag?branch=master">
    <img alt="coverage status" src="https://coveralls.io/repos/github/forivall/react-d3-dag/badge.svg?branch=master">
  </a>
  <a href="https://www.npmjs.com/package/react-d3-dag">
    <img alt="npm package" src="https://img.shields.io/npm/v/react-d3-dag?style=flat">
  </a>
  <a href="https://www.npmjs.com/package/react-d3-dag">
    <img alt="npm package: downloads monthly" src="https://img.shields.io/npm/dm/react-d3-dag.svg">
  </a>
  <a href="https://bundlephobia.com/result?p=react-d3-dag">
    <img alt="npm package: minzipped size" src="https://img.shields.io/bundlephobia/minzip/react-d3-dag">
  </a>
  <a href="https://www.npmjs.com/package/react-d3-dag">
    <img alt="npm package: types" src="https://img.shields.io/npm/types/react-d3-dag">
  </a>
  <a href="https://github.com/prettier/prettier">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg">
  </a>
</p>

<p align="center">
  <h3 align="center"><a href="https://forivall.github.io/react-d3-dag">👾 Playground</a></h3>
  <h3 align="center"><a href="https://forivall.github.io/react-d3-dag/docs">📖 API Documentation (v3)</a></h3>
</p>

NOTE: this is a friendly fork of [react-d3-tree], and will pull upstream when possible.
As such, you may see some references to "tree" in the documentation.

React D3 DAG is a [React](http://facebook.github.io/react/) component that
lets you represent directed acyclical data (e.g. dependency graphs, git history)
as an interactive graph with minimal setup, by leveraging
the [D3](https://d3js.org/)-[`dag`](https://github.com/erikbrinkman/d3-dag)
layout.

> **Upgrading from v1? Check out the [v2 release notes](https://github.com/forivall/react-d3-dag/releases/tag/v2.0.0).**

## Contents <!-- omit in toc -->
- [Installation](#installation)
- [Usage](#usage)
- [Props](#props)
- [Working with the default Tree](#working-with-the-default-tree)
  - [Providing `data`](#providing-data)
  - [Styling Nodes](#styling-nodes)
  - [Styling Links](#styling-links)
  - [Event Handlers](#event-handlers)
- [Customizing the Tree](#customizing-the-tree)
  - [`renderCustomNodeElement`](#rendercustomnodeelement)
  - [`pathFunc`](#pathfunc)
    - [Providing your own `pathFunc`](#providing-your-own-pathfunc)
- [Development](#development)
  - [Setup](#setup)
  - [Hot reloading](#hot-reloading)
- [Contributors](#contributors)

## Installation
```bash
npm i --save react-d3-dag
```

## Usage
```jsx
import React from 'react';
import Tree from 'react-d3-dag';

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
const orgChart = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
};

export default function OrgChartTree() {
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: '50em', height: '20em' }}>
      <Tree data={orgChart} />
    </div>
  );
}
```

## Props
For details on all props accepted by  `Tree`, check out the [TreeProps reference docs](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html).

The only required prop is [data](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html#data), all other props on `Tree` are optional/pre-defined (see "Default value" on each prop definition).

## Working with the default Tree
`react-d3-dag` provides default implementations for `Tree`'s nodes & links, which are intended to get you up & running with a working tree quickly. 

This section is focused on explaining **how to provide data, styles and event handlers for the default `Tree` implementation**. 

> Need more fine-grained control over how nodes & links appear/behave? Check out the [Customizing the Tree](#customizing-the-tree) section below.

### Providing `data`
By default, `Tree` expects each node object in `data` to implement the [`RawNodeDatum` interface](https://forivall.github.io/react-d3-dag/docs/interfaces/_types_common_.rawnodedatum.html):

```ts
interface RawNodeDatum {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: RawNodeDatum[];
}
```

The `orgChart` example in the [Usage](#usage) section above is an example of this:

- Every node has at least a `name`. This is rendered as the **node's primary label**.
- Some nodes have `attributes` defined (the `CEO` node does not). **The key-value pairs in `attributes` are rendered as a list of secondary labels**.
- Nodes can have further `RawNodeDatum` objects nested inside them via the `children` key, creating a hierarchy from which the tree graph can be generated.

### Styling Nodes
`Tree` provides the following props to style different types of nodes, all of which use an SVG `circle` by default:

- `rootNodeClassName` - applied to the root node.
- `branchNodeClassName` - applied to any node with 1+ children.
- `leafNodeClassName` - applied to any node without children.

To visually distinguish these three types of nodes from each other by color, we could provide each with their own class:

```css
/* custom-tree.css */

.node__root > circle {
  fill: red;
}

.node__branch > circle {
  fill: yellow;
}

.node__leaf > circle {
  fill: green
  /* Let's also make the radius of leaf nodes larger */
  r: 40;
}
```

```jsx
import React from 'react';
import Tree from 'react-d3-dag';
import './custom-tree.css';

// ...

export default function StyledNodesTree() {
  return (
    <div id="treeWrapper" style={{ width: '50em', height: '20em' }}>
      <Tree
        data={data}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
      />
    </div>
  );
}
```

 > For more details on the `className` props for nodes, see the [TreeProps reference docs](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html).

### Styling Links
`Tree` provides the `pathClassFunc` property to pass additional classNames to every link to be rendered.

Each link calls `pathClassFunc` with its own `TreeLinkDatum` and the tree's current `orientation`. `Tree` expects `pathClassFunc` to return a `className` string.

```jsx
function StyledLinksTree() {
  const getDynamicPathClass = ({ source, target }, orientation) => {
    if (!target.children) {
      // Target node has no children -> this link leads to a leaf node.
      return 'link__to-leaf';
    }

    // Style it as a link connecting two branch nodes by default.
    return 'link__to-branch';
  };

  return (
    <Tree
      data={data}
      // Statically apply same className(s) to all links
      pathClassFunc={() => 'custom-link'}
      // Want to apply multiple static classes? `Array.join` is your friend :)
      pathClassFunc={() => ['custom-link', 'extra-custom-link'].join(' ')}
      // Dynamically determine which `className` to pass based on the link's properties.
      pathClassFunc={getDynamicPathClass}
    />
  );
}
```

> For more details, see the `PathClassFunction` [reference docs](https://forivall.github.io/react-d3-dag/docs/modules/_types_common_.html#pathclassfunction).

### Event Handlers
`Tree` exposes the following event handler callbacks by default:

- [onLinkClick](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html#onlinkclick)
- [onLinkMouseOut](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html#onlinkmouseout)
- [onLinkMouseOver](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html#onlinkmouseover)
- [onNodeClick](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html#onnodeclick)
- [onNodeMouseOut](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html#onnodemouseout)
- [onNodeMouseOver](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html#onnodemouseover)

> **Note:** Nodes are expanded/collapsed whenever `onNodeClick` fires. To prevent this, set the [`collapsible` prop](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html#collapsible) to `false`.  
> `onNodeClick` will still fire, but it will not change the target node's expanded/collapsed state.

## Customizing the Tree
<!-- Using the `<nodeType>NodeClassName` and `pathClassFunc` approaches above should give  -->

### `renderCustomNodeElement`
The [`renderCustomNodeElement` prop](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html#rendercustomnodeelement) accepts a **custom render function that will be used for every node in the tree.**

Cases where you may find rendering your own `Node` element useful include:

- Using a **different SVG tag for your nodes** (instead of the default `<circle>`) - [Example (codesandbox.io)](https://codesandbox.io/s/rd3t-v2-custom-svg-tag-1bq1e?file=/src/App.js)
- Gaining **fine-grained control over event handling** (e.g. to implement events not covered by the default API) - [Example (codesandbox.io)](https://codesandbox.io/s/rd3t-v2-custom-event-handlers-5pwxw?file=/src/App.js)
- Building **richer & more complex nodes/labels** by leveraging the `foreignObject` tag to render HTML inside the SVG namespace - [Example (codesandbox.io)](https://codesandbox.io/s/rd3t-v2-custom-with-foreignobject-0mfj8?file=/src/App.js)

### `pathFunc`
The [`pathFunc` prop](https://forivall.github.io/react-d3-dag/docs/interfaces/_tree_types_.treeprops.html#pathfunc) accepts a predefined `PathFunctionOption` enum or a user-defined `PathFunction`.

By changing or providing your own `pathFunc`, you are able to change how links between nodes of the tree (which are SVG `path` tags under the hood) are drawn.

The currently [available enums](https://forivall.github.io/react-d3-dag/docs/modules/_types_common_.html#pathfunctionoption) are:
- `diagonal` (default)
- `elbow`
- `straight`
- `step`

> Want to see how each option looks? [Try them out on the playground](https://forivall.github.io/react-d3-dag).

#### Providing your own `pathFunc`
If none of the available path functions suit your needs, you're also able to provide a custom `PathFunction`:

```jsx
function CustomPathFuncTree() {
  const straightPathFunc = (linkDatum, orientation) => {
    const { source, target } = linkDatum;
    return orientation === 'horizontal'
      ? `M${source.y},${source.x}L${target.y},${target.x}`
      : `M${source.x},${source.y}L${target.x},${target.y}`;
  };

  return (
    <Tree
      data={data}
      // Passing `straight` function as a custom `PathFunction`.
      pathFunc={straightPathFunc}
    />
  );
}
```

> For more details, see the [`PathFunction` reference docs](https://forivall.github.io/react-d3-dag/docs/modules/_types_common_.html#pathfunction).

## Development
### Setup
To set up `react-d3-dag` for local development, clone the repo and follow the steps below:

```bash
# 1. Set up the library, create a reference to it for symlinking.
cd react-d3-dag
npm i
npm link

# 2. Set up the demo/playground, symlink to the local copy of `react-d3-dag`.
cd demo
npm i
npm link react-d3-dag
```

> **Tip:** If you'd prefer to use your own app for development instead of the demo, simply run `npm link react-d3-dag` in your app's root folder instead of the demo's :)

### Hot reloading
```bash
npm run build:watch
```

If you're using `react-d3-dag/demo` for development, open up another terminal window in the `demo` directory and call:
```bash
npm start
```

## Contributors
A huge thank you [Ben Kremer](https://github.com/bkrem), author of
[react-d3-tree], which I forked to create this. And thank you to all of the
[contributors](https://github.com/bkrem/react-d3-tree/graphs/contributors) to his project!

[react-d3-tree]: https://github.com/bkrem/react-d3-tree
