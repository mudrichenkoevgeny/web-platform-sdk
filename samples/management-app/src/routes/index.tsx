import React from 'react'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: function IndexRoute() {
    return <Navigate to="/management" />
  }
})
