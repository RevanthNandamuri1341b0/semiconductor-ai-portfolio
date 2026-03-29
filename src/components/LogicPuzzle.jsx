import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Handle,
    Position,
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    ReactFlowProvider,
    useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

const LOGIC_GATES = {
    AND: (a, b) => a && b,
    OR: (a, b) => a || b,
    NAND: (a, b) => !(a && b),
    NOR: (a, b) => !(a || b),
    XOR: (a, b) => a !== b,
    NOT: (a) => !a,
};

// ----------------------------------------------------
// Custom SVG Gates
// ----------------------------------------------------
const GateSVG = ({ type }) => {
    const strokeColor = "#BB86FC";
    const bgFill = "rgba(187,134,252,0.1)";

    switch(type) {
        case 'AND':
            return (
                <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-[0_0_8px_rgba(187,134,252,0.5)] overflow-visible">
                    <path d="M 5 5 L 25 5 A 15 15 0 0 1 40 20 A 15 15 0 0 1 25 35 L 5 35 Z" fill={bgFill} stroke={strokeColor} strokeWidth="2"/>
                </svg>
            );
        case 'NAND':
            return (
                <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-[0_0_8px_rgba(187,134,252,0.5)] overflow-visible">
                    <path d="M 5 5 L 25 5 A 15 15 0 0 1 40 20 A 15 15 0 0 1 25 35 L 5 35 Z" fill={bgFill} stroke={strokeColor} strokeWidth="2"/>
                    <circle cx="44" cy="20" r="4" fill="#050505" stroke={strokeColor} strokeWidth="2"/>
                </svg>
            );
        case 'OR':
            return (
                <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-[0_0_8px_rgba(187,134,252,0.5)] overflow-visible">
                    <path d="M 5 5 C 20 5 35 10 45 20 C 35 30 20 35 5 35 C 10 25 10 15 5 5 Z" fill={bgFill} stroke={strokeColor} strokeWidth="2"/>
                </svg>
            );
        case 'NOR':
            return (
                <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-[0_0_8px_rgba(187,134,252,0.5)] overflow-visible">
                    <path d="M 5 5 C 20 5 35 10 45 20 C 35 30 20 35 5 35 C 10 25 10 15 5 5 Z" fill={bgFill} stroke={strokeColor} strokeWidth="2"/>
                    <circle cx="50" cy="20" r="4" fill="#050505" stroke={strokeColor} strokeWidth="2"/>
                </svg>
            );
        case 'XOR':
            return (
                <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-[0_0_8px_rgba(187,134,252,0.5)] overflow-visible">
                    <path d="M 12 5 C 27 5 42 10 52 20 C 42 30 27 35 12 35 C 17 25 17 15 12 5 Z" fill={bgFill} stroke={strokeColor} strokeWidth="2"/>
                    <path d="M 5 5 C 10 15 10 25 5 35" fill="none" stroke={strokeColor} strokeWidth="2"/>
                </svg>
            );
        case 'NOT':
            return (
                <svg width="60" height="40" viewBox="0 0 60 40" className="drop-shadow-[0_0_8px_rgba(187,134,252,0.5)] overflow-visible">
                    <polygon points="10,5 35,20 10,35" fill={bgFill} stroke={strokeColor} strokeWidth="2"/>
                    <circle cx="40" cy="20" r="4" fill="#050505" stroke={strokeColor} strokeWidth="2"/>
                </svg>
            );
        default: return null;
    }
}

// ----------------------------------------------------
// Custom Nodes
// ----------------------------------------------------
const GateNode = ({ data }) => {
    const isNot = data.type === 'NOT';
    
    // Customize handle offset based on gate shape visually
    const inputOffsetLeft = data.type === 'NOT' ? '10px' : data.type === 'XOR' ? '10px' : data.type === 'OR' || data.type === 'NOR' ? '6px' : '5px';
    const outputOffsetRight = data.type === 'NAND' ? '-5px' : data.type === 'NOR' ? '-11px' : data.type === 'XOR' ? '-13px' : '0'; // align right bounds dynamically

    return (
        <div className="relative w-[60px] h-[40px] flex items-center justify-center cursor-pointer select-none">
            <GateSVG type={data.type} />
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-eda-purple mix-blend-screen opacity-50 pointer-events-none">
                {data.type}
            </div>

            <Handle type="target" position={Position.Left} id="a" className="w-2 h-2 rounded bg-eda-green border-none" style={{ top: isNot ? '50%' : '30%', left: inputOffsetLeft }} />
            {!isNot && <Handle type="target" position={Position.Left} id="b" className="w-2 h-2 rounded bg-eda-green border-none" style={{ top: '70%', left: inputOffsetLeft }} />}
            <Handle type="source" position={Position.Right} id="out" className="w-2 h-2 rounded bg-eda-purple border-none" style={{ right: outputOffsetRight }} />
        </div>
    );
};

const InputNode = ({ data }) => {
    return (
        <div className="relative flex items-center justify-start h-8 w-10 cursor-default select-none">
            <svg width="40" height="32" viewBox="0 0 40 32" className="absolute inset-0 overflow-visible drop-shadow-[0_0_6px_rgba(0,255,65,0.3)]">
                <path d="M 0 0 L 25 0 L 35 16 L 25 32 L 0 32 Z" fill="rgba(0,255,65,0.15)" stroke="#00FF41" strokeWidth="2" />
                <text x="10" y="21" fill="#00FF41" fontSize="14" fontWeight="bold" fontFamily="monospace">{data.label}</text>
            </svg>
            <Handle type="source" position={Position.Right} id="out" className="w-2 h-2 bg-eda-green rounded-full border-none" style={{ right: '-3px' }} />
        </div>
    );
};

const OutputNode = ({ data }) => {
    return (
        <div className="relative flex items-center justify-end h-8 w-10 cursor-default select-none">
            <Handle type="target" position={Position.Left} id="in" className="w-2 h-2 bg-eda-blue rounded-full border-none" style={{ left: '-3px' }} />
            <svg width="40" height="32" viewBox="0 0 40 32" className="absolute inset-0 overflow-visible drop-shadow-[0_0_6px_rgba(0,209,255,0.3)]">
                <path d="M 5 16 L 15 0 L 40 0 L 40 32 L 15 32 Z" fill="rgba(0,209,255,0.15)" stroke="#00D1FF" strokeWidth="2" />
                <text x="18" y="21" fill="#00D1FF" fontSize="14" fontWeight="bold" fontFamily="monospace">{data.label}</text>
            </svg>
        </div>
    );
};

const nodeTypes = {
    logicGate: GateNode,
    inputBtn: InputNode,
    outputBtn: OutputNode
};

// ----------------------------------------------------
// Levels Data
// ----------------------------------------------------
const LEVELS = [
    {
        "level": 1,
        "name": "Level 1: Basic Assignment",
        "equation": "Q = A AND B",
        "desc": "",
        "inputs": [
            "A",
            "B"
        ],
        "truthTable": [
            {
                "A": false,
                "B": false,
                "Q": false
            },
            {
                "A": false,
                "B": true,
                "Q": false
            },
            {
                "A": true,
                "B": false,
                "Q": false
            },
            {
                "A": true,
                "B": true,
                "Q": true
            }
        ],
        "initialNodes": [
            {
                "id": "in_A",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 150
                },
                "data": {
                    "label": "A"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_B",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 300
                },
                "data": {
                    "label": "B"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "out_Q",
                "type": "outputBtn",
                "position": {
                    "x": 800,
                    "y": 225
                },
                "data": {
                    "label": "Q"
                },
                "draggable": false,
                "deletable": false
            }
        ],
        "bestNodes": [
            {
                "id": "g1",
                "type": "logicGate",
                "position": {
                    "x": 400,
                    "y": 225
                },
                "data": {
                    "type": "AND",
                    "label": "AND"
                }
            }
        ],
        "bestEdges": [
            {
                "id": "e1",
                "source": "in_A",
                "sourceHandle": "out",
                "target": "g1",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e2",
                "source": "in_B",
                "sourceHandle": "out",
                "target": "g1",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e3",
                "source": "g1",
                "sourceHandle": "out",
                "target": "out_Q",
                "targetHandle": "in",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            }
        ]
    },
    {
        "level": 2,
        "name": "Level 2: Masking",
        "equation": "Q = (A XOR B) AND C",
        "desc": "",
        "inputs": [
            "A",
            "B",
            "C"
        ],
        "truthTable": [
            {
                "A": false,
                "B": false,
                "C": false,
                "Q": false
            },
            {
                "A": false,
                "B": false,
                "C": true,
                "Q": false
            },
            {
                "A": false,
                "B": true,
                "C": false,
                "Q": false
            },
            {
                "A": false,
                "B": true,
                "C": true,
                "Q": true
            },
            {
                "A": true,
                "B": false,
                "C": false,
                "Q": false
            },
            {
                "A": true,
                "B": false,
                "C": true,
                "Q": true
            },
            {
                "A": true,
                "B": true,
                "C": false,
                "Q": false
            },
            {
                "A": true,
                "B": true,
                "C": true,
                "Q": false
            }
        ],
        "initialNodes": [
            {
                "id": "in_A",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 100
                },
                "data": {
                    "label": "A"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_B",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 225
                },
                "data": {
                    "label": "B"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_C",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 350
                },
                "data": {
                    "label": "C"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "out_Q",
                "type": "outputBtn",
                "position": {
                    "x": 800,
                    "y": 225
                },
                "data": {
                    "label": "Q"
                },
                "draggable": false,
                "deletable": false
            }
        ],
        "bestNodes": [
            {
                "id": "g1",
                "type": "logicGate",
                "position": {
                    "x": 300,
                    "y": 150
                },
                "data": {
                    "type": "XOR",
                    "label": "XOR"
                }
            },
            {
                "id": "g2",
                "type": "logicGate",
                "position": {
                    "x": 550,
                    "y": 225
                },
                "data": {
                    "type": "AND",
                    "label": "AND"
                }
            }
        ],
        "bestEdges": [
            {
                "id": "e1",
                "source": "in_A",
                "sourceHandle": "out",
                "target": "g1",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e2",
                "source": "in_B",
                "sourceHandle": "out",
                "target": "g1",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e3",
                "source": "g1",
                "sourceHandle": "out",
                "target": "g2",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e4",
                "source": "in_C",
                "sourceHandle": "out",
                "target": "g2",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e5",
                "source": "g2",
                "sourceHandle": "out",
                "target": "out_Q",
                "targetHandle": "in",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            }
        ]
    },
    {
        "level": 3,
        "name": "Level 3: Majority Voter",
        "equation": "Q = (A AND B) OR (B AND C) OR (A AND C)",
        "desc": "Best approach uses 5 gates.",
        "inputs": [
            "A",
            "B",
            "C"
        ],
        "truthTable": [
            {
                "A": false,
                "B": false,
                "C": false,
                "Q": false
            },
            {
                "A": false,
                "B": false,
                "C": true,
                "Q": false
            },
            {
                "A": false,
                "B": true,
                "C": false,
                "Q": false
            },
            {
                "A": false,
                "B": true,
                "C": true,
                "Q": true
            },
            {
                "A": true,
                "B": false,
                "C": false,
                "Q": false
            },
            {
                "A": true,
                "B": false,
                "C": true,
                "Q": true
            },
            {
                "A": true,
                "B": true,
                "C": false,
                "Q": true
            },
            {
                "A": true,
                "B": true,
                "C": true,
                "Q": true
            }
        ],
        "initialNodes": [
            {
                "id": "in_A",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 100
                },
                "data": {
                    "label": "A"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_B",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 225
                },
                "data": {
                    "label": "B"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_C",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 350
                },
                "data": {
                    "label": "C"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "out_Q",
                "type": "outputBtn",
                "position": {
                    "x": 800,
                    "y": 225
                },
                "data": {
                    "label": "Q"
                },
                "draggable": false,
                "deletable": false
            }
        ],
        "bestNodes": [
            {
                "id": "g1",
                "type": "logicGate",
                "position": {
                    "x": 250,
                    "y": 100
                },
                "data": {
                    "type": "AND",
                    "label": "AND"
                }
            },
            {
                "id": "g2",
                "type": "logicGate",
                "position": {
                    "x": 250,
                    "y": 225
                },
                "data": {
                    "type": "AND",
                    "label": "AND"
                }
            },
            {
                "id": "g3",
                "type": "logicGate",
                "position": {
                    "x": 250,
                    "y": 350
                },
                "data": {
                    "type": "AND",
                    "label": "AND"
                }
            },
            {
                "id": "g4",
                "type": "logicGate",
                "position": {
                    "x": 450,
                    "y": 150
                },
                "data": {
                    "type": "OR",
                    "label": "OR"
                }
            },
            {
                "id": "g5",
                "type": "logicGate",
                "position": {
                    "x": 650,
                    "y": 225
                },
                "data": {
                    "type": "OR",
                    "label": "OR"
                }
            }
        ],
        "bestEdges": [
            {
                "id": "e1",
                "source": "in_A",
                "sourceHandle": "out",
                "target": "g1",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e2",
                "source": "in_B",
                "sourceHandle": "out",
                "target": "g1",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e3",
                "source": "in_B",
                "sourceHandle": "out",
                "target": "g2",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e4",
                "source": "in_C",
                "sourceHandle": "out",
                "target": "g2",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e5",
                "source": "in_A",
                "sourceHandle": "out",
                "target": "g3",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e6",
                "source": "in_C",
                "sourceHandle": "out",
                "target": "g3",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e7",
                "source": "g1",
                "sourceHandle": "out",
                "target": "g4",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e8",
                "source": "g2",
                "sourceHandle": "out",
                "target": "g4",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e9",
                "source": "g4",
                "sourceHandle": "out",
                "target": "g5",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e10",
                "source": "g3",
                "sourceHandle": "out",
                "target": "g5",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e11",
                "source": "g5",
                "sourceHandle": "out",
                "target": "out_Q",
                "targetHandle": "in",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            }
        ]
    },
    {
        "level": 4,
        "name": "Level 4: 2-to-1 Multiplexer",
        "equation": "Q = (A AND (NOT S)) OR (B AND S)",
        "desc": "Build a generic data selector. S is the control signal.",
        "inputs": [
            "S",
            "A",
            "B"
        ],
        "truthTable": [
            {
                "S": false,
                "A": false,
                "B": false,
                "Q": false
            },
            {
                "S": false,
                "A": false,
                "B": true,
                "Q": false
            },
            {
                "S": false,
                "A": true,
                "B": false,
                "Q": true
            },
            {
                "S": false,
                "A": true,
                "B": true,
                "Q": true
            },
            {
                "S": true,
                "A": false,
                "B": false,
                "Q": false
            },
            {
                "S": true,
                "A": false,
                "B": true,
                "Q": true
            },
            {
                "S": true,
                "A": true,
                "B": false,
                "Q": false
            },
            {
                "S": true,
                "A": true,
                "B": true,
                "Q": true
            }
        ],
        "initialNodes": [
            {
                "id": "in_S",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 100
                },
                "data": {
                    "label": "S"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_A",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 225
                },
                "data": {
                    "label": "A"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_B",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 350
                },
                "data": {
                    "label": "B"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "out_Q",
                "type": "outputBtn",
                "position": {
                    "x": 800,
                    "y": 225
                },
                "data": {
                    "label": "Q"
                },
                "draggable": false,
                "deletable": false
            }
        ],
        "bestNodes": [
            {
                "id": "g1",
                "type": "logicGate",
                "position": {
                    "x": 200,
                    "y": 100
                },
                "data": {
                    "type": "NOT",
                    "label": "NOT"
                }
            },
            {
                "id": "g2",
                "type": "logicGate",
                "position": {
                    "x": 400,
                    "y": 150
                },
                "data": {
                    "type": "AND",
                    "label": "AND"
                }
            },
            {
                "id": "g3",
                "type": "logicGate",
                "position": {
                    "x": 400,
                    "y": 300
                },
                "data": {
                    "type": "AND",
                    "label": "AND"
                }
            },
            {
                "id": "g4",
                "type": "logicGate",
                "position": {
                    "x": 600,
                    "y": 225
                },
                "data": {
                    "type": "OR",
                    "label": "OR"
                }
            }
        ],
        "bestEdges": [
            {
                "id": "e1",
                "source": "in_S",
                "sourceHandle": "out",
                "target": "g1",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e2",
                "source": "in_A",
                "sourceHandle": "out",
                "target": "g2",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e3",
                "source": "g1",
                "sourceHandle": "out",
                "target": "g2",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e4",
                "source": "in_B",
                "sourceHandle": "out",
                "target": "g3",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e5",
                "source": "in_S",
                "sourceHandle": "out",
                "target": "g3",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e6",
                "source": "g2",
                "sourceHandle": "out",
                "target": "g4",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e7",
                "source": "g3",
                "sourceHandle": "out",
                "target": "g4",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e8",
                "source": "g4",
                "sourceHandle": "out",
                "target": "out_Q",
                "targetHandle": "in",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            }
        ]
    },
    {
        "level": 5,
        "name": "Level 5: 4-Input Equality",
        "equation": "Q = (A == B) AND (C == D)",
        "desc": "Outputs high only if both pairs match.",
        "inputs": [
            "A",
            "B",
            "C",
            "D"
        ],
        "truthTable": [
            {
                "A": false,
                "B": false,
                "C": false,
                "D": false,
                "Q": true
            },
            {
                "A": false,
                "B": false,
                "C": false,
                "D": true,
                "Q": false
            },
            {
                "A": false,
                "B": false,
                "C": true,
                "D": false,
                "Q": false
            },
            {
                "A": false,
                "B": false,
                "C": true,
                "D": true,
                "Q": true
            },
            {
                "A": false,
                "B": true,
                "C": false,
                "D": false,
                "Q": false
            },
            {
                "A": false,
                "B": true,
                "C": false,
                "D": true,
                "Q": false
            },
            {
                "A": false,
                "B": true,
                "C": true,
                "D": false,
                "Q": false
            },
            {
                "A": false,
                "B": true,
                "C": true,
                "D": true,
                "Q": false
            },
            {
                "A": true,
                "B": false,
                "C": false,
                "D": false,
                "Q": false
            },
            {
                "A": true,
                "B": false,
                "C": false,
                "D": true,
                "Q": false
            },
            {
                "A": true,
                "B": false,
                "C": true,
                "D": false,
                "Q": false
            },
            {
                "A": true,
                "B": false,
                "C": true,
                "D": true,
                "Q": false
            },
            {
                "A": true,
                "B": true,
                "C": false,
                "D": false,
                "Q": true
            },
            {
                "A": true,
                "B": true,
                "C": false,
                "D": true,
                "Q": false
            },
            {
                "A": true,
                "B": true,
                "C": true,
                "D": false,
                "Q": false
            },
            {
                "A": true,
                "B": true,
                "C": true,
                "D": true,
                "Q": true
            }
        ],
        "initialNodes": [
            {
                "id": "in_A",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 75
                },
                "data": {
                    "label": "A"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_B",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 175
                },
                "data": {
                    "label": "B"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_C",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 275
                },
                "data": {
                    "label": "C"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_D",
                "type": "inputBtn",
                "position": {
                    "x": 0,
                    "y": 375
                },
                "data": {
                    "label": "D"
                },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "out_Q",
                "type": "outputBtn",
                "position": {
                    "x": 800,
                    "y": 225
                },
                "data": {
                    "label": "Q"
                },
                "draggable": false,
                "deletable": false
            }
        ],
        "bestNodes": [
            {
                "id": "g1",
                "type": "logicGate",
                "position": {
                    "x": 200,
                    "y": 125
                },
                "data": {
                    "type": "XOR",
                    "label": "XOR"
                }
            },
            {
                "id": "g2",
                "type": "logicGate",
                "position": {
                    "x": 350,
                    "y": 125
                },
                "data": {
                    "type": "NOT",
                    "label": "NOT"
                }
            },
            {
                "id": "g3",
                "type": "logicGate",
                "position": {
                    "x": 200,
                    "y": 325
                },
                "data": {
                    "type": "XOR",
                    "label": "XOR"
                }
            },
            {
                "id": "g4",
                "type": "logicGate",
                "position": {
                    "x": 350,
                    "y": 325
                },
                "data": {
                    "type": "NOT",
                    "label": "NOT"
                }
            },
            {
                "id": "g5",
                "type": "logicGate",
                "position": {
                    "x": 550,
                    "y": 225
                },
                "data": {
                    "type": "AND",
                    "label": "AND"
                }
            }
        ],
        "bestEdges": [
            {
                "id": "e1",
                "source": "in_A",
                "sourceHandle": "out",
                "target": "g1",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e2",
                "source": "in_B",
                "sourceHandle": "out",
                "target": "g1",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e3",
                "source": "g1",
                "sourceHandle": "out",
                "target": "g2",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e4",
                "source": "in_C",
                "sourceHandle": "out",
                "target": "g3",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e5",
                "source": "in_D",
                "sourceHandle": "out",
                "target": "g3",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e6",
                "source": "g3",
                "sourceHandle": "out",
                "target": "g4",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e7",
                "source": "g2",
                "sourceHandle": "out",
                "target": "g5",
                "targetHandle": "a",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e8",
                "source": "g4",
                "sourceHandle": "out",
                "target": "g5",
                "targetHandle": "b",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            },
            {
                "id": "e9",
                "source": "g5",
                "sourceHandle": "out",
                "target": "out_Q",
                "targetHandle": "in",
                "animated": true,
                "style": {
                    "stroke": "#BB86FC"
                }
            }
        ]
    },
    {
        "level": 6,
        "name": "Level 6: Advanced Logic Path",
        "equation": "Q = ((A XOR B) AND (C NOR D)) OR (A AND C)",
        "desc": "A final synthetic puzzle combining multiple logic conditions.",
        "inputs": [
            "A",
            "B",
            "C",
            "D"
        ],
        "truthTable": [
            { "A": false, "B": false, "C": false, "D": false, "Q": false },
            { "A": false, "B": false, "C": false, "D": true, "Q": false },
            { "A": false, "B": false, "C": true, "D": false, "Q": false },
            { "A": false, "B": false, "C": true, "D": true, "Q": false },
            { "A": false, "B": true, "C": false, "D": false, "Q": true },
            { "A": false, "B": true, "C": false, "D": true, "Q": false },
            { "A": false, "B": true, "C": true, "D": false, "Q": false },
            { "A": false, "B": true, "C": true, "D": true, "Q": false },
            { "A": true, "B": false, "C": false, "D": false, "Q": true },
            { "A": true, "B": false, "C": false, "D": true, "Q": false },
            { "A": true, "B": false, "C": true, "D": false, "Q": true },
            { "A": true, "B": false, "C": true, "D": true, "Q": true },
            { "A": true, "B": true, "C": false, "D": false, "Q": false },
            { "A": true, "B": true, "C": false, "D": true, "Q": false },
            { "A": true, "B": true, "C": true, "D": false, "Q": true },
            { "A": true, "B": true, "C": true, "D": true, "Q": true }
        ],
        "initialNodes": [
            {
                "id": "in_A",
                "type": "inputBtn",
                "position": { "x": 0, "y": 75 },
                "data": { "label": "A" },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_B",
                "type": "inputBtn",
                "position": { "x": 0, "y": 175 },
                "data": { "label": "B" },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_C",
                "type": "inputBtn",
                "position": { "x": 0, "y": 275 },
                "data": { "label": "C" },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "in_D",
                "type": "inputBtn",
                "position": { "x": 0, "y": 375 },
                "data": { "label": "D" },
                "draggable": false,
                "deletable": false
            },
            {
                "id": "out_Q",
                "type": "outputBtn",
                "position": { "x": 800, "y": 225 },
                "data": { "label": "Q" },
                "draggable": false,
                "deletable": false
            }
        ],
        "bestNodes": [
            {
                "id": "g1",
                "type": "logicGate",
                "position": { "x": 200, "y": 75 },
                "data": { "type": "XOR", "label": "XOR" }
            },
            {
                "id": "g2",
                "type": "logicGate",
                "position": { "x": 200, "y": 375 },
                "data": { "type": "NOR", "label": "NOR" }
            },
            {
                "id": "g3",
                "type": "logicGate",
                "position": { "x": 350, "y": 225 },
                "data": { "type": "AND", "label": "AND" }
            },
            {
                "id": "g4",
                "type": "logicGate",
                "position": { "x": 400, "y": 150 },
                "data": { "type": "AND", "label": "AND" }
            },
            {
                "id": "g5",
                "type": "logicGate",
                "position": { "x": 600, "y": 200 },
                "data": { "type": "OR", "label": "OR" }
            }
        ],
        "bestEdges": [
            { "id": "e1", "source": "in_A", "sourceHandle": "out", "target": "g1", "targetHandle": "a", "animated": true, "style": { "stroke": "#BB86FC" } },
            { "id": "e2", "source": "in_B", "sourceHandle": "out", "target": "g1", "targetHandle": "b", "animated": true, "style": { "stroke": "#BB86FC" } },
            { "id": "e3", "source": "in_C", "sourceHandle": "out", "target": "g2", "targetHandle": "a", "animated": true, "style": { "stroke": "#BB86FC" } },
            { "id": "e4", "source": "in_D", "sourceHandle": "out", "target": "g2", "targetHandle": "b", "animated": true, "style": { "stroke": "#BB86FC" } },
            { "id": "e5", "source": "in_A", "sourceHandle": "out", "target": "g3", "targetHandle": "a", "animated": true, "style": { "stroke": "#BB86FC" } },
            { "id": "e6", "source": "in_C", "sourceHandle": "out", "target": "g3", "targetHandle": "b", "animated": true, "style": { "stroke": "#BB86FC" } },
            { "id": "e7", "source": "g1", "sourceHandle": "out", "target": "g4", "targetHandle": "a", "animated": true, "style": { "stroke": "#BB86FC" } },
            { "id": "e8", "source": "g2", "sourceHandle": "out", "target": "g4", "targetHandle": "b", "animated": true, "style": { "stroke": "#BB86FC" } },
            { "id": "e9", "source": "g4", "sourceHandle": "out", "target": "g5", "targetHandle": "a", "animated": true, "style": { "stroke": "#BB86FC" } },
            { "id": "e10", "source": "g3", "sourceHandle": "out", "target": "g5", "targetHandle": "b", "animated": true, "style": { "stroke": "#BB86FC" } },
            { "id": "e11", "source": "g5", "sourceHandle": "out", "target": "out_Q", "targetHandle": "in", "animated": true, "style": { "stroke": "#BB86FC" } }
        ]
    }
];

function LogicPuzzleContent() {
    const { screenToFlowPosition } = useReactFlow();
    const reactFlowWrapper = useRef(null);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [nodes, setNodes] = useState(LEVELS[0].initialNodes);
    const [edges, setEdges] = useState([]);
    const [testStatus, setTestStatus] = useState(null); // 'Equivalence' | 'Nonequivalence' | null
    const [gateCount, setGateCount] = useState(0);

    const levelData = LEVELS[currentLevel];

    // Clear test status on change
    useEffect(() => {
        setTestStatus(null);
        let currentGates = nodes.filter(n => n.type === 'logicGate').length;
        setGateCount(currentGates);
    }, [nodes, edges]);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#BB86FC' } }, eds)),
        []
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: uuidv4(),
                type: 'logicGate',
                position,
                data: { type: type, label: type },
            };
            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes, screenToFlowPosition]
    );

    const onNodeDoubleClick = useCallback((event, node) => {
        if (node.deletable === false) return;
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
    }, [setNodes]);

    const onEdgeDoubleClick = useCallback((event, edge) => {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }, [setEdges]);

    const evaluateFullCircuit = (level, currentNodes, currentEdges) => {
        if (currentEdges.length === 0) return false;

        const outNode = currentNodes.find(n => n.id === 'out_Q');
        if (!outNode) return false;

        const inEdgesMap = {};
        currentEdges.forEach(e => {
            if (!inEdgesMap[e.target]) inEdgesMap[e.target] = {};
            inEdgesMap[e.target][e.targetHandle || 'in'] = e;
        });

        const tryEvalRow = (row, memo) => {
            function evalNode(nodeId) {
                if (memo[nodeId] !== undefined) return memo[nodeId];
                const n = currentNodes.find(x => x.id === nodeId);
                if (!n) return false;

                if (n.type === 'inputBtn') {
                    const val = row[n.data.label];
                    memo[nodeId] = val;
                    return val;
                }

                if (n.type === 'outputBtn') {
                    const edge = inEdgesMap[nodeId]?.['in'];
                    if (!edge) return false;
                    return evalNode(edge.source);
                }

                if (n.type === 'logicGate') {
                    const edgeA = inEdgesMap[nodeId]?.['a'];
                    const valA = edgeA ? evalNode(edgeA.source) : false;

                    let valB = false;
                    if (n.data.type !== 'NOT') {
                        const edgeB = inEdgesMap[nodeId]?.['b'];
                        if (edgeB) valB = evalNode(edgeB.source);
                    } else {
                        valB = false;
                    }

                    const res = LOGIC_GATES[n.data.type](valA, valB);
                    memo[nodeId] = res;
                    return res;
                }

                return false;
            }

            return evalNode(outNode.id);
        };

        for (let row of level.truthTable) {
            const memo = {}; 
            const res = tryEvalRow(row, memo);
            if (res !== row.Q) return false; 
        }
        return true; 
    };

    const handleTest = () => {
        const isCorrect = evaluateFullCircuit(levelData, nodes, edges);
        setTestStatus(isCorrect ? 'Equivalence' : 'Nonequivalence');
    };

    const handleSolve = () => {
        setNodes([...levelData.initialNodes, ...(levelData.bestNodes || [])]);
        setEdges(levelData.bestEdges || []);
        setTestStatus(null);
    };

    const nextLevel = () => {
        if (currentLevel < LEVELS.length - 1) {
            const next = currentLevel + 1;
            setCurrentLevel(next);
            setNodes(LEVELS[next].initialNodes);
            setEdges([]);
            setTestStatus(null);
        }
    };

    const resetBoard = () => {
        setNodes(LEVELS[currentLevel].initialNodes);
        setEdges([]);
        setTestStatus(null);
    };

    const renderDragNode = (type) => (
        <div
            className="border border-eda-purple bg-eda-purple bg-opacity-10 py-1 flex flex-col items-center justify-center rounded cursor-grab active:cursor-grabbing hover:bg-opacity-20 transition-all box-border overflow-hidden"
            onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', type);
                event.dataTransfer.effectAllowed = 'move';
            }}
            draggable
        >
            <div className="scale-75 origin-center -mb-1 mt-1 opacity-70">
                <GateSVG type={type} />
            </div>
            <span className="text-[10px] font-bold text-eda-purple tracking-widest">{type}</span>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#030303] text-white select-none">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-eda-purple/20">
                <div>
                    <h2 className="text-xl font-bold text-eda-purple flex items-center gap-2">
                        {levelData.name}
                    </h2>
                    <p className="text-sm text-eda-blue font-mono mt-1 opacity-70">
                        Target Equation: {levelData.equation} {levelData.desc && `| ${levelData.desc}`}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs font-mono text-eda-purple opacity-50">
                        Gates Used: <span className={gateCount > 5 && currentLevel === 2 ? 'text-red-400' : 'text-eda-green'}>{gateCount}</span>
                    </div>

                    <button
                        onClick={handleTest}
                        className="text-sm border border-eda-green text-eda-green px-4 py-1.5 font-bold hover:bg-eda-green/10 transition-colors uppercase tracking-widest"
                    >
                        Test
                    </button>

                    <button onClick={resetBoard} className="text-xs border border-white/20 px-3 py-1 hover:bg-white/10 transition-colors">
                        Reset
                    </button>

                    <button 
                        onClick={handleSolve} 
                        className="text-xs border border-eda-blue text-eda-blue px-3 py-1 hover:bg-eda-blue/10 transition-colors"
                        title="Show Optimal Configuration"
                    >
                        Auto-Solve
                    </button>

                    {testStatus === 'Equivalence' && currentLevel < LEVELS.length - 1 && (
                        <button
                            onClick={nextLevel}
                            className="text-xs bg-eda-purple text-black font-bold px-4 py-1.5 hover:bg-purple-400 transition-colors"
                        >
                            Next Module ▷
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                <div className="w-24 border-r border-eda-purple/20 bg-[#050505] p-3 flex flex-col gap-3 z-10 box-border items-stretch">
                    <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest text-center">Primitives</div>
                    {renderDragNode('AND')}
                    {renderDragNode('OR')}
                    {renderDragNode('NAND')}
                    {renderDragNode('NOR')}
                    {renderDragNode('XOR')}
                    {renderDragNode('NOT')}
                </div>

                {/* Canvas */}
                <div className="flex-1 h-[500px] relative pointer-events-auto" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeDoubleClick={onNodeDoubleClick}
                        onEdgeDoubleClick={onEdgeDoubleClick}
                        nodeTypes={nodeTypes}
                        
                        // Board locking mechanism
                        panOnDrag={false}
                        zoomOnScroll={false}
                        zoomOnDoubleClick={false}
                        zoomOnPinch={false}
                        panOnScroll={false}
                        preventScrolling={false}
                        
                        fitView
                        fitViewOptions={{ padding: 0.0 }}
                        proOptions={{ hideAttribution: true }}
                        className="bg-black"
                    >
                        <Background color="#BB86FC" gap={20} size={1} opacity={0.15} />
                        <Controls showZoom={false} showInteractive={false} className="opacity-0 pointer-events-none" />
                    </ReactFlow>

                    {/* Result Overlay */}
                    <AnimatePresence>
                        {testStatus && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                className={`absolute top-6 left-1/2 -translate-x-1/2 border px-6 py-3 rounded backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] z-20 pointer-events-none ${
                                    testStatus === 'Equivalence' 
                                        ? 'border-eda-green bg-eda-green/10 text-eda-green shadow-[0_0_15px_rgba(0,255,65,0.2)]'
                                        : 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                }`}
                            >
                                <h3 className="font-bold text-lg uppercase tracking-wider text-center">
                                    {testStatus}
                                </h3>
                                <p className="text-xs opacity-70 font-mono text-center">
                                    {testStatus === 'Equivalence' ? 'Logic verified successfully.' : 'Output mismatch detected.'}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Level Selector Sidebar - RIGHT */}
                <div className="w-32 border-l border-eda-purple/20 bg-[#050505] p-3 flex flex-col gap-2 z-10 box-border overflow-y-auto">
                    <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest text-center">Modules</div>
                    {LEVELS.map((lvl, index) => (
                        <button
                            key={lvl.level}
                            onClick={() => {
                                setCurrentLevel(index);
                                setNodes(LEVELS[index].initialNodes);
                                setEdges([]);
                                setTestStatus(null);
                            }}
                            className={`text-left text-[11px] font-bold tracking-widest py-3 px-3 rounded transition-all border ${
                                currentLevel === index 
                                    ? 'bg-eda-purple text-black border-eda-purple' 
                                    : 'bg-transparent text-eda-purple border-eda-purple/20 hover:bg-eda-purple/10'
                            }`}
                            title={lvl.name}
                        >
                            LVL {lvl.level}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function LogicPuzzle() {
    return (
        <ReactFlowProvider>
            <LogicPuzzleContent />
        </ReactFlowProvider>
    );
}

