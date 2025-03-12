import { create } from 'zustand';
import {
  type Edge,
  type OnConnect,
  type OnConnectEnd,
  type OnNodesChange,
  type OnEdgesChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { generateNodeId, nodeCatalog } from '../nodes/nodeCatalog';
import { initialNodes } from '../nodes';
import { initialEdges } from '../edges';
import type { AppNode } from '../nodes/types';

type NodePickerPosition = {
  x: number;
  y: number;
} | null;

type NodeStore = {
  // Node state
  nodes: AppNode[];
  edges: Edge[];
  
  // Node picker state
  nodePickerPosition: NodePickerPosition;
  connectionNodeId: string | null;
  
  // Node operations
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: React.SetStateAction<AppNode[]>) => void;
  setEdges: (edges: React.SetStateAction<Edge[]>) => void;
  
  // Node picker operations
  setNodePickerPosition: (position: NodePickerPosition) => void;
  setConnectionNodeId: (nodeId: string | null) => void;
  handleNodeSelection: (nodeType: string, position: { x: number; y: number }) => void;
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
  connectionNodeId: null,
  
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
  
  // Node picker operations
  setNodePickerPosition: (position) => set({ nodePickerPosition: position }),
  setConnectionNodeId: (nodeId) => set({ connectionNodeId: nodeId }),
  
  handleNodeSelection: (nodeType, position) => {
    const { connectionNodeId, nodes, edges } = get();
    
    if (!connectionNodeId) return;
    
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
    
    // Create the new edge
    const newEdge = {
      id: `edge-${connectionNodeId}-${id}`,
      source: connectionNodeId,
      target: id,
    };
    
    set({
      nodes: [...nodes, newNode as AppNode],
      edges: [...edges, newEdge],
      nodePickerPosition: null,
      connectionNodeId: null,
    });
  },
  
  onConnectEnd: (event, connectionState) => {
    if (!connectionState.isValid && connectionState.fromNode) {
      // When a connection is dropped on the pane it's not valid, but we want to show the node picker
      const { clientX, clientY } =
        'changedTouches' in event
          ? event.changedTouches[0]
          : (event as MouseEvent);
      
      // For the picker, we want to use screen coordinates rather than flow coordinates
      set({
        nodePickerPosition: {
          x: clientX,
          y: clientY,
        },
        connectionNodeId: connectionState.fromNode.id,
      });
    }
  },
  
  closeNodePicker: () => {
    set({
      nodePickerPosition: null,
      connectionNodeId: null,
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
