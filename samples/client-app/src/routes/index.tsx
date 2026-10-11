import { createFileRoute } from '@tanstack/react-router'
import { HomeScreen } from '@/ui/screen/home/HomeScreen'

export const Route = createFileRoute('/')({
  component: HomeScreen
})
