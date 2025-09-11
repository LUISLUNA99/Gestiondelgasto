import React from 'react'
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react'
import { Gasto } from '../lib/supabase'

interface ResumenGastosProps {
  gastos: Gasto[]
}

const ResumenGastos: React.FC<ResumenGastosProps> = ({ gastos }) => {
  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)
  
  const gastosHoy = gastos.filter(gasto => {
    const hoy = new Date().toISOString().split('T')[0]
    return gasto.fecha === hoy
  })
  
  const gastosEsteMes = gastos.filter(gasto => {
    const hoy = new Date()
    const fechaGasto = new Date(gasto.fecha)
    return fechaGasto.getMonth() === hoy.getMonth() && 
           fechaGasto.getFullYear() === hoy.getFullYear()
  })
  
  const totalHoy = gastosHoy.reduce((sum, gasto) => sum + gasto.monto, 0)
  const totalEsteMes = gastosEsteMes.reduce((sum, gasto) => sum + gasto.monto, 0)
  
  const promedioDiario = gastosEsteMes.length > 0 
    ? totalEsteMes / new Date().getDate() 
    : 0

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(monto)
  }

  const stats = [
    {
      title: 'Total General',
      value: formatMonto(totalGastos),
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Hoy',
      value: formatMonto(totalHoy),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Este Mes',
      value: formatMonto(totalEsteMes),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Promedio Diario',
      value: formatMonto(promedioDiario),
      icon: TrendingDown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className={`text-2xl font-semibold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ResumenGastos
