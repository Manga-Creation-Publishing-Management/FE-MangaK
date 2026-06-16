// Component Footer (Chân trang) dùng để tái sử dụng ở nhiều nơi (như HomePage)
export function FooterPage() {
    return (
        <>
            {/* 
              Thẻ footer cố định ở dưới cùng, nội dung căn giữa
              Sử dụng các class tailwind (py-5, bg-background, border-t) để tạo khoảng cách và đường viền phía trên
            */}
            <footer className="col-span-1 md:col-span-12 w-full flex text-sidebar-primary text-sm items-center justify-center py-5
            bg-background border-t border-border">
                © 2026 MangaK Management System. All rights reserved.
            </footer>
        </>
    )
}