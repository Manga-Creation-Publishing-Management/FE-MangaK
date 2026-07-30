import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Text, Rect } from 'react-konva';

export function KonvaDraw({
    width,
    height,
    tool = 'brush',          
    lines = [],              
    setLines,                
    texts = [],              
    setTexts,                
    color,                   
    isReadOnly = false       
}) {
    
    const isDrawing = useRef(false);

    const isDrawingText = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const [tempRect, setTempRect] = useState(null);
    const [editingText, setEditingText] = useState(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (editingText && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [editingText]);

    const handleMouseDown = (e) => {
        if (isReadOnly) return; 

        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();

        if (tool === 'brush') {
            
            isDrawing.current = true;
            setLines([...lines, { points: [pos.x, pos.y], color: color }]);
        }
        else if (tool === 'eraser') {
            
            isDrawing.current = true;
        }
        else if (tool === 'text') {
            
            if (editingText) {
                handleTextSubmit();
            }
            
            isDrawingText.current = true;
            startPos.current = pos;
            setTempRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
        }
    };

    const handleMouseMove = (e) => {
        if (isReadOnly) return;

        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();

        if (tool === 'brush' && isDrawing.current) {
            
            const lastLine = lines[lines.length - 1];
            if (!lastLine) return;

            const updatedLine = {
                ...lastLine,
                points: lastLine.points.concat([pos.x, pos.y])
            };

            const updatedLines = [...lines];
            updatedLines[updatedLines.length - 1] = updatedLine;
            setLines(updatedLines);
        }
        else if (tool === 'text' && isDrawingText.current) {
            setTempRect({
                x: Math.min(startPos.current.x, pos.x),
                y: Math.min(startPos.current.y, pos.y),
                width: Math.abs(startPos.current.x - pos.x),
                height: Math.abs(startPos.current.y - pos.y)
            });
        }
    };

    const handleMouseUp = (e) => {
        if (isReadOnly) return;

        if (tool === 'brush' || tool === 'eraser') {
            isDrawing.current = false;
        }
        else if (tool === 'text' && isDrawingText.current) {
            isDrawingText.current = false;
            const stage = e.target.getStage();
            const pos = stage.getPointerPosition();
            const x = Math.min(startPos.current.x, pos.x);
            const y = Math.min(startPos.current.y, pos.y);
            let width = Math.abs(startPos.current.x - pos.x);
            let height = Math.abs(startPos.current.y - pos.y);

            if (width < 5 || height < 5) {
                width = 150;
                height = 50;
            }

            setEditingText({
                x,
                y,
                width,
                height,
                text: ''
            });
            setTempRect(null);
        }
    };

    const handleTextSubmit = () => {
        if (editingText) {
            if (editingText.text.trim()) {
                const newTextNode = {
                    id: `txt_${Date.now()}`,
                    x: editingText.x,
                    y: editingText.y,
                    width: editingText.width,
                    text: editingText.text,
                    color: color
                };
                setTexts([...texts, newTextNode]);
            }
            setEditingText(null);
        }
    };

    const handleTextKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTextSubmit();
        } else if (e.key === 'Escape') {
            setEditingText(null);
        }
    };

    const getCursor = () => {
        if (isReadOnly) return 'default';
        if (tool === 'brush' || tool === 'text') return 'crosshair';
        if (tool === 'eraser') return 'cell';
        return 'default';
    };

    return (
        <div style={{ position: 'relative', width, height }}>
            <Stage
                width={width}
                height={height}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: getCursor() }}
            >
                <Layer>
                    
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.color || "#ef4444"}
                            strokeWidth={2}
                            hitStrokeWidth={12} 
                            tension={0.5}      
                            lineCap="round"    
                            lineJoin="round"   
                            draggable={tool === 'move' && !isReadOnly}
                            onDragEnd={(e) => {
                                const node = e.target;
                                const dx = node.x();
                                const dy = node.y();

                                const newPoints = line.points.map((val, idx) =>
                                    idx % 2 === 0 ? val + dx : val + dy
                                );

                                node.x(0);
                                node.y(0);

                                const newLines = [...lines];
                                newLines[i] = {
                                    ...line,
                                    points: newPoints
                                };
                                setLines(newLines);
                            }}
                            onMouseDown={(e) => {
                                if (tool === 'eraser' && !isReadOnly) {
                                    e.cancelBubble = true; 
                                    const newLines = lines.filter((_, idx) => idx !== i);
                                    setLines(newLines);
                                }
                            }}
                            onMouseEnter={(e) => {
                                if (tool === 'move' && !isReadOnly) {
                                    const stage = e.target.getStage();
                                    stage.container().style.cursor = 'move';
                                } else if (tool === 'eraser' && !isReadOnly) {
                                    const stage = e.target.getStage();
                                    stage.container().style.cursor = 'crosshair';
                                    if (isDrawing.current) {
                                        
                                        const newLines = lines.filter((_, idx) => idx !== i);
                                        setLines(newLines);
                                    }
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (tool === 'move' && !isReadOnly) {
                                    const stage = e.target.getStage();
                                    stage.container().style.cursor = 'default';
                                } else if (tool === 'eraser' && !isReadOnly) {
                                    const stage = e.target.getStage();
                                    stage.container().style.cursor = 'default';
                                }
                            }}
                        />
                    ))}

                    {texts.map((item) => (
                        <Text
                            key={item.id}
                            width={item.width || 150}
                            x={item.x}
                            y={item.y}
                            text={item.text}
                            fontSize={16}
                            fill={item.color || "#ef4444"}
                            draggable={tool === 'move' && !isReadOnly}
                            onDragEnd={(e) => {
                                const node = e.target;
                                const newX = node.x();
                                const newY = node.y();

                                const newTexts = texts.map((t) => {
                                    if (t.id === item.id) {
                                        return {
                                            ...t,
                                            x: newX,
                                            y: newY
                                        };
                                    }
                                    return t;
                                });
                                setTexts(newTexts);
                            }}
                            onMouseEnter={(e) => {
                                if (tool === 'move' && !isReadOnly) {
                                    const stage = e.target.getStage();
                                    stage.container().style.cursor = 'move';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (tool === 'move' && !isReadOnly) {
                                    const stage = e.target.getStage();
                                    stage.container().style.cursor = 'default';
                                }
                            }}
                        />
                    ))}

                    {tempRect && (
                        <Rect
                            x={tempRect.x}
                            y={tempRect.y}
                            width={tempRect.width}
                            height={tempRect.height}
                            stroke={color || "#ef4444"}
                            strokeWidth={1}
                            dash={[4, 4]}
                        />
                    )}
                </Layer>
            </Stage>

            {editingText && (
                <textarea
                    ref={textareaRef}
                    value={editingText.text}
                    onChange={(e) => setEditingText({ ...editingText, text: e.target.value })}
                    onBlur={handleTextSubmit}
                    onKeyDown={handleTextKeyDown}
                    placeholder="Enter comment here..."
                    style={{
                        position: 'absolute',
                        left: `${editingText.x}px`,
                        top: `${editingText.y}px`,
                        width: `${editingText.width}px`,
                        height: `${editingText.height}px`,
                        fontSize: '16px',
                        color: color || '#ef4444',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: `1.5px dashed ${color || '#ef4444'}`,
                        borderRadius: '4px',
                        outline: 'none',
                        resize: 'none',
                        zIndex: 100,
                        padding: '4px',
                        margin: 0,
                        fontFamily: 'sans-serif',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                    }}
                />
            )}
        </div>
    );
}