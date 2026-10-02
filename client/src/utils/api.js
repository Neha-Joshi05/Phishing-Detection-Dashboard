import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const analyzeEmail  = data => axios.post(`${BASE}/api/analyze`, data)
export const getHistory    = (limit=50) => axios.get(`${BASE}/api/history?limit=${limit}`)
export const clearHistory  = () => axios.delete(`${BASE}/api/history`)
export const getStats      = () => axios.get(`${BASE}/api/stats`)
export const getDataset    = () => axios.get(`${BASE}/api/dataset`)