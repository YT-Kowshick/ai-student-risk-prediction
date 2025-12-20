const API_BASE_URL = "https://ai-student-risk-backend.onrender.com/";

// Log API configuration on module load
console.log(`API configured to: ${API_BASE_URL}`);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
}

export interface PredictionRequest {
  marks: number;
  attendance: number;
  feedback: string;
}

export interface PredictionResponse {
  risk: "Good" | "Average" | "At-Risk";
  sentiment: "Positive" | "Neutral" | "Negative";
  reasons: string[];
}

// Health check - verify backend is reachable
export async function healthCheck(): Promise<boolean> {
  try {
    console.log("Performing health check...");
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
    });
    console.log(`Health check response: ${response.status}`);
    return response.ok;
  } catch (err) {
    console.error("Health check failed:", err);
    return false;
  }
}

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  console.log(`Attempting login for: ${credentials.email}`);
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    if (response.status === 401) {
      console.error("Login failed: Invalid credentials");
      throw new Error("Invalid email or password");
    }
    const errorText = await response.text();
    console.error(`Login failed with status ${response.status}: ${errorText}`);
    throw new Error("Login failed. Please try again.");
  }

  const data = await response.json();
  console.log("Login successful");
  return data;
}

export async function predictRisk(data: PredictionRequest): Promise<PredictionResponse> {
  console.log("Starting prediction request...");
  console.log(`Request payload:`, data);
  
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(`Prediction response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Prediction failed with status ${response.status}: ${errorText}`);
      
      // Try to parse error from JSON
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || "Failed to get prediction. Please try again.");
      } catch {
        throw new Error(`Prediction failed (${response.status}). Please ensure the backend is running on ${API_BASE_URL}`);
      }
    }

    const result = await response.json();
    console.log("Prediction successful:", result);
    return result;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Prediction error:", err.message);
      throw err;
    }
    console.error("Unknown prediction error:", err);
    throw new Error(`Failed to connect to the prediction API at ${API_BASE_URL}. Please ensure the backend is running.`);
  }
}
