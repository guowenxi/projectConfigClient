import request from "@/services/request";

// 简单的通用请求方式
export async function getList(data: any, url: string, method: string) {
    const opt: { method: string, params?: any, data?: any } = {
        method
    }
    return request(url, opt);
}
