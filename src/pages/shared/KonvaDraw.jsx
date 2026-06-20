import { useState, useRef } from 'react';
import { Stage, Layer, Line } from 'react-konva';

export function KonvaDraw({ width, height, lines, setLines, color, isReadOnly = false }) {
    const isDrawing = useRef(false);

    const handleMouseDown = (e) => {
        if (isReadOnly) return; //Nếu là Mangaka hoặc Assistant ở trường hợp read-only
        //thì k cho vẽ
        const pos = e.target.getStage().getPointerPosition();

        //bắt đầu vẽ một nét mới, màu hiện tại
        setLines([...lines, { points: [pos.x, pos.y], color: color }]);

    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current || isReadOnly) return; //Nếu đang không vẽ hoặc ở read-only thì k làm

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();

        let lastLine = lines[lines.length - 1];

        lastLine.points = lastLine.points.concat([point.x, point.y]);

        //update mảng
        lines.splice(lines.length - 1, 1, lastLine);
        setLines([...lines]);
    };

    const handleMouseUp = () => {
        isDrawing.current = false; //thả chuột là k vẽ nữa
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
            <Layer>
                {lines.map((line, i) => (
                    <Line
                        key={i}
                        points={line.points}
                        stroke={line.color || "#ef4444"} //lấy màu nét đó, mặc định đỏ
                        strokeWidth={2}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                    />

                ))}
            </Layer>
        </Stage>
    )

}