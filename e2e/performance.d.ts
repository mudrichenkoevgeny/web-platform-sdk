interface MemoryMetrics {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

interface Performance {
  memory?: MemoryMetrics
}
