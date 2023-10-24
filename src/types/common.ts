import { SyntheticEvent } from 'react';
import {
  GraphLink as DagLink,
  GraphNode as DagNode,
  Hierarchy,
  Children as DagChildren,
  WrappedChildren as DagWrappedChildren,
} from 'd3-dag';

export type Orientation = 'horizontal' | 'vertical';

export interface Point {
  x: number;
  y: number;
}

export interface RawNodeDatum {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: RawNodeDatum[];
}

export interface TreeNodeDatum extends RawNodeDatum {
  children?: TreeNodeDatum[];
  __rd3dag: {
    id: string;
    depth: number;
    collapsed: boolean;
  };
}

export type DagHierarchy<NodeDatum, LinkDatum = undefined> = Hierarchy<
  NodeDatum,
  LinkDatum,
  DagChildren<NodeDatum>,
  DagWrappedChildren<NodeDatum, DagChildren<NodeDatum>>
>;

export type PathFunctionOption = 'diagonal' | 'elbow' | 'straight' | 'step';
export type PathFunction = (link: DagLink<TreeNodeDatum>, orientation: Orientation) => string;
export type PathClassFunction = PathFunction;

export type SyntheticEventHandler = (evt: SyntheticEvent) => void;
export type AddChildrenFunction = (children: RawNodeDatum[]) => void;

/**
 * The properties that are passed to the user-defined `renderCustomNodeElement` render function.
 */
export interface CustomNodeElementProps {
  /**
   * The full datum of the node that is being rendered.
   */
  nodeDatum: TreeNodeDatum;
  /**
   * The D3 `DagNode` representation of the node, which wraps `nodeDatum`
   * with additional properties.
   */
  dagNode: DagNode<TreeNodeDatum>;
  /**
   * Toggles the expanded/collapsed state of the node.
   *
   * Provided for customized control flow; e.g. if we want to toggle the node when its
   * label is clicked instead of the node itself.
   */
  toggleNode: () => void;
  /**
   * The `onNodeClick` handler defined for `Tree` (if any).
   */
  onNodeClick: SyntheticEventHandler;
  /**
   * The `onNodeMouseOver` handler defined for `Tree` (if any).
   */
  onNodeMouseOver: SyntheticEventHandler;
  /**
   * The `onNodeMouseOut` handler defined for `Tree` (if any).
   */
  onNodeMouseOut: SyntheticEventHandler;
  /**
   * The `Node` class's internal `addChildren` handler.
   */
  addChildren: AddChildrenFunction;
}

export type RenderCustomNodeElementFn = (rd3dagNodeProps: CustomNodeElementProps) => JSX.Element;
