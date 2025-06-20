import axios from "axios";
import { useState } from "react";

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      // Handle 401 errors with automatic token refresh
      if (err.response?.status === 401 && url !== "/api/auth/refresh") {
        try {
          // Attempt to refresh token
          await axios.post("/api/auth/refresh");
          // Retry original request
          const retryResponse = await axios[method](url, { ...body, ...props });
          if (onSuccess) {
            onSuccess(retryResponse.data);
          }
          return retryResponse.data;
        } catch (refreshErr) {
          // Refresh failed, redirect to signin
          window.location.href = "/auth/signin";
          return;
        }
      }

      setErrors(
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {err.response?.data?.errors?.map((err, index) => (
              <li key={`err${index}`}>{err.message}</li>
            )) || [<li key="unknown">Something went wrong</li>]}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};

export default useRequest;
