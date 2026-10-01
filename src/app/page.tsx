import type { Metadata } from 'next';
import Link from 'next/link';
import { Hero } from '../components/Hero';
import { ProductShowcase, ReadyStrip } from '../components/ProductShowcase';
import { SystemStory } from '../components/SystemStory';

export default function HomePage() {
  return (
    <div className="w-full bg-white">
      <Hero
        compact
        accent="red"
        headline="One Model. Three Ways In."
        subhead="Quancis builds Kael, a composite intelligence — and the products people actually use it through."
      />

      <section className="px-[clamp(20px,5vw,48px)] pt-[clamp(48px,7vh,72px)] pb-[clamp(88px,14vh,150px)] scroll-mt-[100px]">
        <ProductShowcase />
      </section>

      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <SystemStory />
      </section>

      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,176px)] scroll-mt-[100px]">
        <SystemStory />
      </section>

      <section className="px-[clamp(20px,5vw,48px)] pb-[clamp(88px,15vh,180px)] scroll-mt-[100px]">
        <ReadyStrip />
      </section>
    </div>
  );
}
