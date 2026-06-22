import HeroSection from "@/components/home/HeroSection";
import FeaturedMedicines from "@/components/home/FeaturedMedicines";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoriesSection />
      <FeaturedMedicines />
      <WhyChooseUs />
      <TestimonialsSection />
    </div>
  );
}
