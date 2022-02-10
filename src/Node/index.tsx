import React, { SyntheticEvent } from 'react';
import { select } from 'd3-selection';

import { Orientation, Point, TreeNodeDatum, RenderCustomNodeElementFn } from '../types/common';
import DefaultNodeElement from './DefaultNodeElement';
import { DagNode } from 'd3-dag';

type NodeEventHandler = (dagNode: DagNode<TreeNodeDatum>, evt: SyntheticEvent) => void;

type NodeProps = {
  data: TreeNodeDatum;
  position: Point;
  dagNode: DagNode<TreeNodeDatum>;
  nodeClassName: string;
  nodeSize: {
    x: number;
    y: number;
  };
  orientation: Orientation;
  enableLegacyTransitions: boolean;
  transitionDuration: number;
  renderCustomNodeElement: RenderCustomNodeElementFn;
  onNodeToggle: (nodeId: string) => void;
  onNodeClick: NodeEventHandler;
  onNodeMouseOver: NodeEventHandler;
  onNodeMouseOut: NodeEventHandler;
  subscriptions: object;
};

type NodeState = {
  transform: string;
  initialStyle: { opacity: number };
};

export default class Node extends React.Component<NodeProps, NodeState> {
  private nodeRef: SVGGElement = null;

  state = {
    transform: this.setTransform(this.props.position, this.props.orientation, true),
    initialStyle: {
      opacity: 0,
    },
  };

  componentDidMount() {
    this.commitTransform();
  }

  componentDidUpdate() {
    this.commitTransform();
  }

  shouldComponentUpdate(nextProps: NodeProps) {
    return this.shouldNodeTransform(this.props, nextProps);
  }

  shouldNodeTransform = (ownProps: NodeProps, nextProps: NodeProps) =>
    nextProps.subscriptions !== ownProps.subscriptions ||
    nextProps.position.x !== ownProps.position.x ||
    nextProps.position.y !== ownProps.position.y ||
    nextProps.orientation !== ownProps.orientation;

  setTransform(
    position: NodeProps['position'],
    orientation: NodeProps['orientation'],
    shouldTranslateToOrigin = false
  ) {
    if (shouldTranslateToOrigin) {
      return `translate(0,0)`;
    }
    return orientation === 'horizontal'
      ? `translate(${position.y},${position.x})`
      : `translate(${position.x},${position.y})`;
  }

  applyTransform(
    transform: string,
    transitionDuration: NodeProps['transitionDuration'],
    opacity = 1,
    done = () => {}
  ) {
    if (this.props.enableLegacyTransitions) {
      select(this.nodeRef)
        // @ts-ignore
        .transition()
        .duration(transitionDuration)
        .attr('transform', transform)
        .style('opacity', opacity)
        .on('end', done);
    } else {
      select(this.nodeRef)
        .attr('transform', transform)
        .style('opacity', opacity);
      done();
    }
  }

  commitTransform() {
    const { orientation, transitionDuration, position } = this.props;
    const transform = this.setTransform(position, orientation);
    this.applyTransform(transform, transitionDuration);
  }

  // TODO: needs tests
  renderNodeElement = () => {
    const { data, dagNode, renderCustomNodeElement } = this.props;
    const renderNode =
      typeof renderCustomNodeElement === 'function' ? renderCustomNodeElement : DefaultNodeElement;
    const nodeProps = {
      dagNode,
      nodeDatum: data,
      toggleNode: this.handleNodeToggle,
      onNodeClick: this.handleOnClick,
      onNodeMouseOver: this.handleOnMouseOver,
      onNodeMouseOut: this.handleOnMouseOut,
    };

    return renderNode(nodeProps);
  };

  handleNodeToggle = () => this.props.onNodeToggle(this.props.data.__rd3dag.id);

  handleOnClick = evt => {
    this.props.onNodeClick(this.props.dagNode, evt);
  };

  handleOnMouseOver = evt => {
    this.props.onNodeMouseOver(this.props.dagNode, evt);
  };

  handleOnMouseOut = evt => {
    this.props.onNodeMouseOut(this.props.dagNode, evt);
  };

  componentWillLeave(done) {
    const { orientation, transitionDuration, position } = this.props;
    const transform = this.setTransform(position, orientation, true);
    this.applyTransform(transform, transitionDuration, 0, done);
  }

  render() {
    const { data, nodeClassName } = this.props;
    return (
      <g
        id={data.__rd3dag.id}
        ref={n => {
          this.nodeRef = n;
        }}
        style={this.state.initialStyle}
        className={[data.children ? 'rd3dag-node' : 'rd3dag-leaf-node', nodeClassName]
          .join(' ')
          .trim()}
        transform={this.state.transform}
      >
        {this.renderNodeElement()}
      </g>
    );
  }
}
