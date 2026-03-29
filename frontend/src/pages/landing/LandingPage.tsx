import Header from '../../pages/landing/components/Header'
import Hero from '../../pages/landing/components/Hero'
import FeaturesSection from '../../pages/landing/components/FeaturesSection'
import HowItWorks from '../../pages/landing/components/HowItWorks'
import Footer from '../../pages/landing/components/Footer'
import Pricing from '../../pages/landing/components/Pricing'

export default function LandingPage() {
  return (
    <>
      <main className='bg-[#101622]'>
        <Header />
        <Hero />
        <FeaturesSection />
        <HowItWorks />
        <Pricing />
        <Footer />
      </main>

    </>

  )
}
