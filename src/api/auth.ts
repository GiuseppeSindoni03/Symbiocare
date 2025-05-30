import api from "../services/axiosInstance";
import { RegisterInfo } from "../types/registration-form";
import { User } from "../types/user.interface";

interface LoginData {
  email: string;
  password: string;
}

export async function login({ email, password }: LoginData) {
  const res = await api.post<User>(
    "/auth/signin",
    { email, password },
    { withCredentials: true }
  );

  // console.log("Res: ", res);
  // console.log("Data: ", res.data);

  return res.data;
}

export async function logout() {
  const res = await api.post("auth/logout", {}, { withCredentials: true });

  return res.data;
}

export async function register(registerInfo: RegisterInfo) {
  const res = await api.post("auth/signup", registerInfo, {
    withCredentials: true,
  });

  return res.data;
}
