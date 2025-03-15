import { create } from 'zustand';
import {
  type Edge,
  type OnConnect,
  type OnConnectEnd,
  type OnNodesChange,
  type OnEdgesChange,
  type HandleType,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { generateNodeId, nodeCatalog } from '../nodes/nodeCatalog';
import { initialNodes } from '../nodes';
import { initialEdges } from '../edges';
import type { AppNode } from '../nodes/types';
import type {
  FlowNodeData,
  DataType,
} from '../components/nodes/FlowNode/FlowNode';

type NodePickerPosition = {
  x: number;
  y: number;
} | null;

type ConnectionContext = {
  nodeId: string | null;
  handleId: string | null;
  handleType: HandleType | null;
  dataType: DataType | null;
};

type NodeStore = {
  // Node state
  nodes: AppNode[];
  edges: Edge[];

  // Node picker state
  nodePickerPosition: NodePickerPosition;
  connectionContext: ConnectionContext;

  // Node operations
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: React.SetStateAction<AppNode[]>) => void;
  setEdges: (edges: React.SetStateAction<Edge[]>) => void;

  // Node picker operations
  handleNodeSelection: (
    nodeType: string,
    position: { x: number; y: number },
  ) => void;
  onConnectEnd: OnConnectEnd;
  closeNodePicker: () => void;

  // Node creation
  addNode: (nodeType: string, position?: { x: number; y: number }) => void;
};

export const useNodeStore = create<NodeStore>((set, get) => ({
  // Initial state
  nodes: initialNodes,
  edges: initialEdges,
  nodePickerPosition: null,
  connectionContext: {
    nodeId: null,
    handleId: null,
    handleType: null,
    dataType: null,
  },

  // Node state operations
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as AppNode[],
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  setNodes: (nodes) => {
    if (typeof nodes === 'function') {
      set({ nodes: nodes(get().nodes) });
    } else {
      set({ nodes });
    }
  },

  setEdges: (edges) => {
    if (typeof edges === 'function') {
      set({ edges: edges(get().edges) });
    } else {
      set({ edges });
    }
  },

  handleNodeSelection: (nodeType, position) => {
    const { connectionContext, nodes, edges } = get();

    if (!connectionContext.nodeId || !connectionContext.handleId) return;

    // Create the new node
    const id = generateNodeId(nodeType);
    const catalogNode = nodeCatalog[nodeType];

    if (!catalogNode) return;

    // We need to convert screen coordinates to flow coordinates in component
    const newNode = {
      id,
      type: 'flow',
      position, // This will be converted in the component
      data: catalogNode.nodeData,
      dragHandle: '.dragHandle',
    };

    // Find the first compatible handle based on connection context
    const targetHandle =
      connectionContext.handleType === 'source'
        ? catalogNode.nodeData.inputs?.find(
            (input) =>
              input.hasHandle !== false &&
              input.dataType === connectionContext.dataType,
          )?.name
        : catalogNode.nodeData.outputs?.find(
            (output) => output.dataType === connectionContext.dataType,
          )?.name;

    // Create the new edge based on handle type (source = output, target = input)
    const newEdge = {
      id: `edge-${connectionContext.nodeId}-${id}`,
      ...(connectionContext.handleType === 'source'
        ? {
            source: connectionContext.nodeId,
            sourceHandle: connectionContext.handleId,
            target: id,
            targetHandle,
          }
        : {
            source: id,
            sourceHandle: targetHandle,
            target: connectionContext.nodeId,
            targetHandle: connectionContext.handleId,
          }),
    };

    set({
      nodes: [...nodes, newNode as AppNode],
      edges: [...edges, newEdge],
      nodePickerPosition: null,
      connectionContext: {
        nodeId: null,
        handleId: null,
        handleType: null,
        dataType: null,
      },
    });
  },

  onConnectEnd: (event, connectionState) => {
    if (!connectionState.isValid && connectionState.fromNode) {
      // When a connection is dropped on the pane it's not valid, but we want to show the node picker
      const { clientX, clientY } =
        'changedTouches' in event
          ? event.changedTouches[0]
          : (event as MouseEvent);

      // Determine the handle type (source=output, target=input)
      const handleType = connectionState.fromHandle?.type || null;

      // Get the data type of the port
      let dataType: DataType | null = null;

      if (connectionState.fromNode && connectionState.fromHandle) {
        const node = get().nodes.find(
          (n) => n.id === connectionState.fromNode?.id,
        );

        if (node?.data && node.type === 'flow') {
          const flowNodeData = node.data as FlowNodeData;

          // Extract data type based on handle type and id
          if (handleType === 'source' && flowNodeData.outputs) {
            const output = flowNodeData.outputs.find(
              (o) => o.name === connectionState.fromHandle?.id,
            );
            dataType = output?.dataType || null;
          } else if (handleType === 'target' && flowNodeData.inputs) {
            const input = flowNodeData.inputs.find(
              (i) => i.name === connectionState.fromHandle?.id,
            );
            dataType = input?.dataType || null;
          }
        }
      }

      // For the picker, we want to use screen coordinates rather than flow coordinates
      set({
        nodePickerPosition: {
          x: clientX,
          y: clientY,
        },
        connectionContext: {
          nodeId: connectionState.fromNode.id,
          handleId: connectionState.fromHandle?.id || null,
          handleType,
          dataType,
        },
      });
    }
  },

  closeNodePicker: () => {
    set({
      nodePickerPosition: null,
      connectionContext: {
        nodeId: null,
        handleId: null,
        handleType: null,
        dataType: null,
      },
    });
  },

  // Node creation
  addNode: (nodeType, position) => {
    const catalogNode = nodeCatalog[nodeType];
    if (!catalogNode) return;

    // The position will be determined at the component level
    // as we need access to reactFlowInstance

    // Create a new node
    const newNode = {
      id: generateNodeId(nodeType),
      type: 'flow',
      position: position || { x: 0, y: 0 }, // This will be updated in the component
      data: catalogNode.nodeData,
      dragHandle: '.dragHandle',
    };

    set((state) => ({
      nodes: [...state.nodes, newNode as AppNode],
    }));
  },
}));
