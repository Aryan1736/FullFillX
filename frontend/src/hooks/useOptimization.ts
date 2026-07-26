import { useMutation } from '@tanstack/react-query'

import { optimizationService } from '../services/optimizationService'
import type { OptimizationRunInput } from '../types/optimization'

export const optimizationMutationKey = ['optimization', 'run'] as const

export function useOptimization() {
  return useMutation({
    mutationKey: optimizationMutationKey,
    mutationFn: (input: OptimizationRunInput) => optimizationService.runOptimization(input),
  })
}
