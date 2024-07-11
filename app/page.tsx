import PriceDisplay from '../components/PriceDisplay'

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PriceDisplay />
    </div>
  )
}