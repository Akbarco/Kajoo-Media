import api from '@/lib/api';

interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export const uploadService = {
  uploadMedia: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file); // 'image' is the field name expected by the server

    const res = await api.post<{ success: boolean; data: UploadResponse }>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res.data.data;
  },
};
