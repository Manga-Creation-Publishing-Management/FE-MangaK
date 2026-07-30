
const BASE_URL = import.meta.env.VITE_API_URL;

async function request(endpoint, options = {}) {
  
  const token = localStorage.getItem('accessToken');
  
  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    
    const response = await fetch(url, config);
    
    if (response.status === 204) {
      return null;
    }

    if (response.status === 401) {
      if (!endpoint.includes('/Auth/') && !options._isRetry) {
        
          options._isRetry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error ('There is no refresh token stored');

            const refreshResponse = await api.post('/Auth/refresh', {refreshToken});
            
            localStorage.setItem('accessToken', refreshResponse.accessToken || refreshResponse?.data.accessToken);
            localStorage.setItem('refreshToken', refreshResponse.refreshToken || refreshResponse?.data.refreshToken);
            
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
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      
      if (response.status === 401) {
        
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

    return data;
  } catch (error) {
    
    if (!options?.silent) {
      console.error(`API Error on ${url}:`, error);
    }
    throw error;
  }
}

export const api = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};
