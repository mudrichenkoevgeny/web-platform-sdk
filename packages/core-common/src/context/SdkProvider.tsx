import React, { createContext, useContext, useMemo } from 'react'
import { CommonComponent } from '../di/CommonComponent'
import { AppErrorParser } from '../error/parser/AppErrorParser'
import { CommonErrorParser } from '../error/parser/CommonErrorParser'

const CommonComponentContext = createContext<CommonComponent | null>(null)
const ErrorParserContext = createContext<AppErrorParser>(new CommonErrorParser())

export interface SdkProviderProps {
  component: CommonComponent
  children: React.ReactNode
}

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

export const useCommonComponent = (): CommonComponent => {
  const context = useContext(CommonComponentContext)
  if (!context) {
    throw new Error('CommonComponent not provided! Wrap your app in <SdkProvider>.')
  }
  return context
}

export const useAppErrorParser = (): AppErrorParser => {
  return useContext(ErrorParserContext)
}
