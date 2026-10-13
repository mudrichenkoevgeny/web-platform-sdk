import { useRouter, type NavigateOptions, type RegisteredRouter } from '@tanstack/react-router'

export function useNavigateUp() {
  const routerInstance = useRouter()

  return <
    TFrom extends string = string,
    TTo extends string = string,
    TMaskFrom extends string = TFrom,
    TMaskTo extends string = ''
  >(
    opts: NavigateOptions<RegisteredRouter, TFrom, TTo, TMaskFrom, TMaskTo>
  ) => {
    const historyState = routerInstance.state.location.state as { __TSR_index?: number } | undefined
    const currentIndex = historyState?.__TSR_index ?? 0

    if (currentIndex > 0) {
      routerInstance.history.back()
    } else {
      void routerInstance.navigate({
        ...(opts as Parameters<typeof routerInstance.navigate>[0]),
        replace: true
      })
    }
  }
}
