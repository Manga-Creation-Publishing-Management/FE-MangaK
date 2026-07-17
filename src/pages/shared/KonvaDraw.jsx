import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Text, Rect } from 'react-konva';

/**
 * Component KonvaDraw hiển thị lớp vẽ Canvas đè lên trang PDF.
 * Hỗ trợ chế độ vẽ cọ (brush), viết chữ chú thích (text) kéo thả, và di chuyển nét vẽ/text (move).
 */
export function KonvaDraw({
    width,
    height,
    tool = 'brush',          // Công cụ đang chọn: 'brush', 'text', hoặc 'move'
    lines = [],              // Danh sách các nét vẽ của trang hiện tại
    setLines,                // Setter cập nhật danh sách nét vẽ
    texts = [],              // Danh sách các chữ chú thích của trang hiện tại
    setTexts,                // Setter cập nhật danh sách chữ chú thích
    color,                   // Màu vẽ/viết chữ hiện tại đang chọn
    isReadOnly = false       // Chế độ chỉ đọc
}) {
    // Trạng thái giữ chuột khi đang vẽ cọ (brush)
    const isDrawing = useRef(false);

    // Trạng thái khi đang kéo thả tạo vùng text box
    const isDrawingText = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const [tempRect, setTempRect] = useState(null);
    const [editingText, setEditingText] = useState(null);
    const textareaRef = useRef(null);

    // Tự động focus vào ô nhập chữ khi xuất hiện
    useEffect(() => {
        if (editingText && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [editingText]);

    /**
     * Xử lý sự kiện nhấn chuột xuống Canvas
     */
    const handleMouseDown = (e) => {
        if (isReadOnly) return; // Nếu là chế độ chỉ đọc thì không cho vẽ hay chèn chữ

        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();

        if (tool === 'brush') {
            // Chế độ cọ vẽ: Bắt đầu ghi nhận nét vẽ mới
            isDrawing.current = true;
            setLines([...lines, { points: [pos.x, pos.y], color: color }]);
        }
        else if (tool === 'text') {
            // Nếu đang gõ dở một text khác, submit trước
            if (editingText) {
                handleTextSubmit();
            }
            // Bắt đầu vẽ khung chữ nhật tạm để đặt text
            isDrawingText.current = true;
            startPos.current = pos;
            setTempRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
        }
    };

    /**
     * Xử lý sự kiện di chuyển chuột để vẽ nét hoặc vẽ khung text box
     */
    const handleMouseMove = (e) => {
        if (isReadOnly) return;

        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();

        if (tool === 'brush' && isDrawing.current) {
            // Lấy nét vẽ cuối cùng đang thực hiện
            const lastLine = lines[lines.length - 1];
            if (!lastLine) return;

            // Tạo bản sao mới của nét vẽ để tránh mutate prop trực tiếp
            const updatedLine = {
                ...lastLine,
                points: lastLine.points.concat([pos.x, pos.y])
            };

            // Cập nhật lại nét vẽ đó trong mảng lines
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

    /**
     * Xử lý sự kiện thả chuột để kết thúc nét vẽ hoặc hiển thị ô gõ chữ
     */
    const handleMouseUp = (e) => {
        if (isReadOnly) return;

        if (tool === 'brush') {
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

            // Nếu click nhanh hoặc khoảng cách kéo quá nhỏ thì cho kích thước mặc định
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

    /**
     * Lưu đoạn text vừa gõ vào danh sách texts
     */
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

    /**
     * Xử lý phím tắt khi đang nhập text
     */
    const handleTextKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleTextSubmit();
        } else if (e.key === 'Escape') {
            setEditingText(null);
        }
    };

    /**
     * Lấy con trỏ chuột dựa theo công cụ đang chọn
     */
    const getCursor = () => {
        if (isReadOnly) return 'default';
        if (tool === 'brush' || tool === 'text') return 'crosshair';
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
                    {/* 1. Vẽ các nét vẽ (lines) */}
                    {lines.map((line, i) => (
                        <Line
                            key={i}
                            points={line.points}
                            stroke={line.color || "#ef4444"}
                            strokeWidth={2}
                            tension={0.5}      // Làm mịn các khúc cua của nét vẽ
                            lineCap="round"    // Bo tròn đầu nét vẽ
                            lineJoin="round"   // Bo tròn điểm tiếp nối các nét
                            draggable={tool === 'move' && !isReadOnly}
                            onDragEnd={(e) => {
                                const node = e.target;
                                const dx = node.x();
                                const dy = node.y();

                                // Dịch chuyển trực tiếp các tọa độ trong mảng points để đảm bảo cấu trúc data nguyên bản
                                const newPoints = line.points.map((val, idx) =>
                                    idx % 2 === 0 ? val + dx : val + dy
                                );

                                // Reset offset vẽ của Konva về 0 để tránh bị nhân đôi độ lệch
                                node.x(0);
                                node.y(0);

                                const newLines = [...lines];
                                newLines[i] = {
                                    ...line,
                                    points: newPoints
                                };
                                setLines(newLines);
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

                    {/* 2. Hiển thị các chữ chú thích (texts) */}
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

                    {/* 3. Vẽ khung chữ nhật đứt nét tạm thời khi người dùng đang kéo chuột tạo vùng text */}
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

            {/* Form nhập nhận xét đè lên vùng Canvas */}
            {editingText && (
                <textarea
                    ref={textareaRef}
                    value={editingText.text}
                    onChange={(e) => setEditingText({ ...editingText, text: e.target.value })}
                    onBlur={handleTextSubmit}
                    onKeyDown={handleTextKeyDown}
                    placeholder="Nhập nhận xét..."
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