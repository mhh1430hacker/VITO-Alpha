import api from './api'

export const multimodelAPI = {
  predict: (data: any) => api.post('/api/v1/predict/multimodel', data),
  batchPredict: (data: any) => api.post('/api/v1/predict/batch', data),
  optimizeGenetic: (data: any) => api.post('/api/v1/optimize/genetic', data),
  getModelRegistry: () => api.get('/api/v1/models/registry'),
  reloadModel: (modelId: string) => api.post('/api/v1/models/reload', { model_id: modelId }),
  getGPUInfo: () => api.get('/api/v1/gpu/info'),
}

export default multimodelAPI
