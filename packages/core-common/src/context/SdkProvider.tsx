import React, { createContext, useContext, useMemo } from 'react'
import { CommonComponent } from '../di/CommonComponent'
import { AppErrorParser } from '../error/parser/AppErrorParser'
import { CommonErrorParser } from '../error/parser/CommonErrorParser'

const CommonComponentContext = createContext<CommonComponent | null>(null)
const ErrorParserContext = createContext<AppErrorParser>(new CommonErrorParser())

/** Properties for {@link SdkProvider}. */
export interface SdkProviderProps {
  /** Root {@link CommonComponent} DI container instance. */
  component: CommonComponent
  /** React component child subtree. */
  children: React.ReactNode
}

/**
 * Top-level React context provider supplying CommonComponent and AppErrorParser to children.
 *
 * @param props - Provider properties
 * @returns JSX Element wrapping children with context providers
 */
export const SdkProvider: React.FC<SdkProviderProps> = ({ component, children }) => {
  const errorParser = useMemo(() => {
    try {
      return component.appErrorParser
    } catch {
      return new CommonErrorParser()
    }
  }, [component])

  return (
    <CommonComponentContext.Provider value={component}>
      <ErrorParserContext.Provider value={errorParser}>
        {children}
      </ErrorParserContext.Provider>
    </CommonComponentContext.Provider>
  )
}

/**
 * React hook retrieving the current {@link CommonComponent} instance from context.
 *
 * @returns Resolved {@link CommonComponent} instance
 * @throws Error if called outside of {@link SdkProvider}
 */
export const useCommonComponent = (): CommonComponent => {
  const context = useContext(CommonComponentContext)
  if (!context) {
    throw new Error('CommonComponent not provided! Wrap your app in <SdkProvider>.')
  }
  return context
}

/**
 * React hook retrieving the current {@link AppErrorParser} instance from context.
 *
 * @returns Resolved {@link AppErrorParser} instance
 */
export const useAppErrorParser = (): AppErrorParser => {
  return useContext(ErrorParserContext)
}
