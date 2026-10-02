import { AppError } from '../../../error/model/AppError'
import { SocketFrame } from '../../model/websocket/SocketFrame'

/**
 * Result returned by a {@link WebSocketMessageHandler} handling an incoming frame.
 */
export type WebSocketMessageHandlerResult =
  | { readonly kind: 'NotHandled' }
  | { readonly kind: 'Handled' }
  | { readonly kind: 'SendSocketFrame'; readonly socketFrame: SocketFrame }
  | { readonly kind: 'Error'; readonly appError: AppError }

/**
 * Creates a result indicating the message frame was not handled by the handler.
 *
 * @returns Instance of 'NotHandled' result
 */
export const webSocketMessageHandlerResultNotHandled = (): WebSocketMessageHandlerResult => ({
  kind: 'NotHandled'
})

/**
 * Creates a result indicating the message frame was successfully handled.
 *
 * @returns Instance of 'Handled' result
 */
export const webSocketMessageHandlerResultHandled = (): WebSocketMessageHandlerResult => ({
  kind: 'Handled'
})

/**
 * Creates a result directing the WebSocket service to dispatch a response frame.
 *
 * @param socketFrame - Response socket frame to send
 * @returns Instance of 'SendSocketFrame' result
 */
export const webSocketMessageHandlerResultSend = (
  socketFrame: SocketFrame
): WebSocketMessageHandlerResult => ({
  kind: 'SendSocketFrame',
  socketFrame
})

/**
 * Creates a result indicating a handler processing error.
 *
 * @param appError - Application error cause
 * @returns Instance of 'Error' result
 */
export const webSocketMessageHandlerResultError = (
  appError: AppError
): WebSocketMessageHandlerResult => ({
  kind: 'Error',
  appError
})
