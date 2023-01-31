import request from "@/services/request";

export const statusType = [
  "agreement_type",
  "module_status",
  "point_type",
  "data_type",
  "register_type",
  "serial_port",
  "check_bit",
  "data_bit",
  "stop_bit",
  "baud_rate",
  "brand_type",
  "version_type",
  "function_type",
]

// 简单的通用请求方式
export async function requestData(data: any, url: string, method: string) {
  const opt: { method: string, params?: any, data?: any } = {
    method,
  }
  'GET,DELETE'.indexOf(method.toUpperCase()) >= 0 ? opt.params = data : opt.data = data;
  return request(url, opt);
}
