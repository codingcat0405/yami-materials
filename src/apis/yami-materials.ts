import axiosClient from "./axiosClient.ts";

const yamiMaterials = {
  login: async (data: any): Promise<any> => {
    return await axiosClient.post('/auth/login', data);
  },
  listMaterials: async (params = {}): Promise<any> => {
    return await axiosClient.get('/materials', {params});
  },
  createMaterial: async (data: any): Promise<any> => {
    return await axiosClient.post('/materials', data);
  },
  updateMaterial: async (id: string, data: any): Promise<any> => {
    return await axiosClient.post(`/materials/${id}`, data);
  },
  deleteMaterial: async (id: string): Promise<any> => {
    return await axiosClient.delete(`/materials/${id}`);
  },
  getPresignedUrl: async (fileName: string): Promise<any> => {
    return await axiosClient.get(`/upload/presigned-url?file=${fileName}`);
  },
  bulkCUD: async (data: any): Promise<any> =>{
    return await axiosClient.post('/materials/bulk-cud', data);
  }

}

export default yamiMaterials;
