// Lấy URL cơ bản của API từ biến môi trường (cấu hình trong file .env)
const BASE_URL = import.meta.env.VITE_API_URL;

// Hàm request cốt lõi: xử lý mọi yêu cầu (GET, POST, PUT, DELETE...) tới server
async function request(endpoint, options = {}) {
  // Lấy token xác thực từ Local Storage (được lưu sau khi người dùng đăng nhập)
  const token = localStorage.getItem('accessToken');
  
  // Khởi tạo headers với các thông số mặc định hoặc được truyền vào
  const headers = {
    ...options.headers,
  };

  // Nếu body không phải là FormData (thường dùng để upload file), ta thiết lập Content-Type là JSON
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Nếu có token, đính kèm token vào header Authorization theo chuẩn Bearer Token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Gộp cấu hình options với headers đã tinh chỉnh
  const config = {
    ...options,
    headers,
  };

  // Tự động chuyển đổi dữ liệu body (object) sang chuỗi JSON nếu body không phải là FormData
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  // Hỗ trợ cả URL tuyệt đối (bắt đầu bằng http) lẫn URL tương đối (ghép với BASE_URL)
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    // Thực thi gọi API với fetch
    const response = await fetch(url, config);
    
    // Xử lý trường hợp server trả về mã 204 No Content (thành công nhưng không có dữ liệu trả về)
    if (response.status === 204) {
      return null;
    }

    if (response.status === 401) {
      if (!endpoint.includes('/Auth/') && !options._isRetry) {
        //đánh dấu đã refresh r nha mà vẫn fail  
          options._isRetry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error ('There is no refresh token stored');

            //gọi API refresh token 
            const refreshResponse = await api.post('/Auth/refresh', {refreshToken});
            //lưu token mới
            localStorage.setItem('accessToken', refreshResponse.accessToken || refreshResponse?.data.accessToken);
            localStorage.setItem('refreshToken', refreshResponse.refreshToken || refreshResponse?.data.refreshToken);
            
            //gọi lại hàm request này với token mới
            return await request(endpoint, options);

          } catch (refreshError) {
              console.error('Refresh token failed:', refreshError);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.location.href = '/';
              return null;
          }

      } 
    }

    let data;
    // Kiểm tra định dạng dữ liệu trả về: Nếu là JSON thì parse JSON, ngược lại đọc dưới dạng Text
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Nếu HTTP Status Code không nằm trong dải thành công (200-299), ném ra lỗi
    if (!response.ok && !options._isRetry) {
      // Nếu gặp lỗi xác thực 401 (token hết hạn hoặc không hợp lệ)
      if (response.status === 401) {
        // Không tự động redirect nếu đang thực hiện các cuộc gọi API liên quan đến Auth (đăng nhập, đăng ký, quên mật khẩu...)
        if (!endpoint.includes('/Auth/')) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/';
          return null;
        }
      }

      const errorMsg = (data && typeof data === 'object' && (data.message || data.error)) 
        || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    // Trả về dữ liệu nếu gọi API thành công
    return data;
  } catch (error) {
    // Bắt và in ra lỗi mạng hoặc lỗi API để dễ debug (nếu không bật cờ silent)
    if (!options?.silent) {
      console.error(`API Error on ${url}:`, error);
    }
    throw error;
  }
}

// Xuất (export) đối tượng api cung cấp các hàm gọi HTTP thông dụng
// Việc đóng gói này giúp code ở các Component ngắn gọn hơn và dễ bảo trì
export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};
