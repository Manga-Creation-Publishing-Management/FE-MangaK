import { useRef } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';

/**
 * Component KonvaDraw hiển thị lớp vẽ Canvas đè lên trang PDF.
 * Hỗ trợ chế độ vẽ cọ (brush) và viết chữ chú thích (text) tại tọa độ nhấp chuột.
 */
export function KonvaDraw({
    width,
    height,
    tool = 'brush',          // Công cụ đang chọn: 'brush' hoặc 'text'
    textInput = '',          // Chuỗi chữ người dùng đang nhập ở ô input ngoài
    onTextPlaced,            // Callback chạy sau khi chữ được đặt thành công xuống canvas
    lines = [],              // Danh sách các nét vẽ của trang hiện tại
    setLines,                // Setter cập nhật danh sách nét vẽ
    texts = [],              // Danh sách các chữ chú thích của trang hiện tại
    setTexts,                // Setter cập nhật danh sách chữ chú thích
    color,                   // Màu vẽ/viết chữ hiện tại đang chọn
    isReadOnly = false       // Chế độ chỉ đọc
}) {
    // Trạng thái giữ chuột khi đang vẽ
    const isDrawing = useRef(false);

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
            // Chế độ gõ chữ: Chỉ chèn chữ nếu ô nhập liệu không trống
            if (!textInput.trim()) return;

            // Thêm một node text mới vào mảng texts của trang hiện tại
            const newTextNode = {
                id: `txt_${Date.now()}`, // Tạo id duy nhất bằng timestamp
                x: pos.x,
                y: pos.y,
                text: textInput,
                color: color
            };
            setTexts([...texts, newTextNode]);

            // Gọi callback để reset ô nhập liệu trên thanh công cụ sau khi đặt chữ thành công
            if (onTextPlaced) {
                onTextPlaced();
            }
        }
    };

    /**
     * Xử lý sự kiện di chuyển chuột để vẽ nét (chỉ dùng cho brush)
     */
    const handleMouseMove = (e) => {
        if (!isDrawing.current || isReadOnly || tool !== 'brush') return;

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        // Lấy nét vẽ cuối cùng đang thực hiện
        const lastLine = lines[lines.length - 1];
        if (!lastLine) return;

        // Tạo bản sao mới của nét vẽ để tránh mutate prop trực tiếp
        const updatedLine = {
            ...lastLine,
            points: lastLine.points.concat([point.x, point.y])
        };

        // Cập nhật lại nét vẽ đó trong mảng lines
        const updatedLines = [...lines];
        updatedLines[updatedLines.length - 1] = updatedLine;
        setLines(updatedLines);
    };

    /**
     * Xử lý sự kiện thả chuột để kết thúc nét vẽ
     */
    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    return (
        <Stage
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: isReadOnly ? 'default' : 'crosshair' }} // Con trỏ hình chữ thập khi được vẽ
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
                    />
                ))}

                {/* 2. Hiển thị các chữ chú thích (texts) */}
                {texts.map((item) => (
                    <Text
                        key={item.id}
                        width={150}
                        x={item.x}
                        y={item.y}
                        text={item.text}
                        fontSize={16}
                        fill={item.color || "#ef4444"}
                    />
                ))}
            </Layer>
        </Stage>
    );
}