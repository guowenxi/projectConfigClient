/**
 * 基础公共接口
 */
import { get, post } from "./axios.js";
import request from "@/services/request";

export async function testCnode() {
  return request('api/api/v1/topics');
}


export async function getPageData() {
  return get("/user-list");
}

export async function login(params:any) {
  console.log(params);
  return post("/login", params);
}

// 获取单个组件配置文件 common.json
export async function getComConfigJSON(params:any) {
  return request("/cbs/getComPackageJson", {
    method: "POST",
    data: params,
    requestType: "json",
  });
}

// 获取单个类型组件列表
export async function getOneTypeComList(params:any) {
  return request("/cbs/getOneTypeComList", {
    method: "POST",
    data: params,
    requestType: "json",
  });
}

export async function getUploadBase64File(params:any) {
  console.log("postBase64", params);
  return request("/postBase64", {
    method: "POST",
    data: params,
    requestType: "json",
  });
}

export async function uploadFieldFiles(data:any) {
  return request("/uploadFile", {
    method: "POST",
    data,
    timeout: 3 * 1000,
  });
}
