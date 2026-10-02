import { AppError } from '../../../error/model/AppError'
import { SocketFrame } from '../../model/websocket/SocketFrame'

export type WebSocketMessageHandlerResult =
  | { readonly kind: 'NotHandled' }
  | { readonly kind: 'Handled' }
  | { readonly kind: 'SendSocketFrame'; readonly socketFrame: SocketFrame }
  | { readonly kind: 'Error'; readonly appError: AppError }

export const webSocketMessageHandlerResultNotHandled = (): WebSocketMessageHandlerResult => ({
  kind: 'NotHandled'
})

export const webSocketMessageHandlerResultHandled = (): WebSocketMessageHandlerResult => ({
  kind: 'Handled'
})

export const webSocketMessageHandlerResultSend = (
  socketFrame: SocketFrame
): WebSocketMessageHandlerResult => ({
  kind: 'SendSocketFrame',
  socketFrame
})

export const webSocketMessageHandlerResultError = (
  appError: AppError
): WebSocketMessageHandlerResult => ({
  kind: 'Error',
  appError
})
