import { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

export function KonvaDraw({ width, height, lines, setLines, color, isReadOnly = false }) {
    const isDrawing = useRef(false);

    const handleMouseDown = (e) => {//Nhấn chuột
        if (isReadOnly) return; //Nếu là Mangaka hoặc Assistant (người nhận) ở trường hợp read-only
        //thì k cho vẽ
        isDrawing.current = true; //bắt đầu vẽ
        const pos = e.target.getStage().getPointerPosition();

        //bắt đầu khởi tạo vị trí một nét mới, màu hiện tại, sau đó lưu vào mảng lines (useState đó)
        setLines([...lines, { points: [pos.x, pos.y], color: color }]);

    };

    const handleMouseMove = (e) => {//kéo giữ chuột để vẽ
        if (!isDrawing.current || isReadOnly) return; //Nếu đang không đặt chuột vẽ (mouseDown) hoặc ở read-only thì k làm

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        let lastLine = lines[lines.length - 1]; //lấy cái tạo độ vừa lưu lúc mouseDown

        lastLine.points = lastLine.points.concat([point.x, point.y]); //nối toạ độ mới vào cuối mảng

        //update mảng lines
        lines.splice(lines.length - 1, 1, lastLine);
        //dòng phía trên, sẽ xóa cái nét lúc mousedown, thay bằng đống nét đã được nối vào
        setLines([...lines]);
    };

    const handleMouseUp = () => {
        isDrawing.current = false; //thả chuột ra không vẽ nữa
    };

    return (
        <Stage
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: isReadOnly ? 'default' : 'crosshair' }} //con trỏ hình x nếu đang vẽ
        >
            {/* Cái line là dùng để vẽ các lines đã thêm trong list cái tọa độ ở trên */}
            <Layer>
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line.points}
                        stroke={line.color || "#ef4444"} //lấy màu nét đó, mặc định đỏ
                        strokeWidth={2}
                        tension={0.5}//nội suy đường cong (thuật toán) dùng để làm mềm cái điểm chuyển tiếp
                        lineCap="round"//bo tròn hai đầu mút
                        lineJoin="round"//các đoạn nhỏ trong nét vẽ được nối lại
                    />

                ))}
            </Layer>
        </Stage>
    )

}