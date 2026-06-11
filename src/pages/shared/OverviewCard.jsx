// Component OverviewCard: Dùng để hiển thị các thẻ thống kê tổng quan (ví dụ: Số lượng user, doanh thu, v.v.)
// Nhận vào các props:
// - iconName: Component Icon (ví dụ từ thư viện lucide-react)
// - iconColor: Màu sắc hiển thị cho icon (mã hex, rgba, hoặc biến CSS)
// - contentText: Tiêu đề hoặc nhãn mô tả cho thẻ (vd: "Total Users")
// - valueNum: Giá trị con số thống kê (vd: 1,234)
export function OverviewCard({ iconName, iconColor, contentText, valueNum }) {

    return (
        <>
            {/* Vỏ ngoài của Card, có bo góc, border, và hiệu ứng shadow khi hover */}
            <div className="w-full bg-card rounded-2xl p-6 border-1 border-gray-200 
            flex flex-col items-start gap-2 hover:shadow">
                
                {/* Vùng hiển thị Icon
                    Màu sắc được truyền qua thuộc tính style (inline style) vì các màu icon thường đa dạng và động
                */}
                <div className={"p-3 rounded-md bg-background"} style={{ color: iconColor }}>
                    {iconName}
                </div>

                {/* Nhãn mô tả (vd: Tên thống kê) */}
                <p className="text-muted-foreground">{contentText}</p>
                
                {/* Giá trị thống kê (con số hiển thị to và đậm) */}
                <p className="text-sidebar-foreground text-3xl font-medium">{valueNum}</p>
            </div>
        </>
    );
}