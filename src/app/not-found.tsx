import Link from 'next/link';
import { BrandMark } from '../components/BrandMark';
import { ROUTES } from '../lib/routes';

export default function NotFound() {
  return (
    <div className="w-full bg-white px-[clamp(20px,5vw,48px)] py-[clamp(100px,18vh,200px)]">
      <div className="max-w-[480px] mx-auto text-center">
        <BrandMark size={40} className="mx-auto mb-8 text-ink" />
        <h1 className="page-title">Page not found.</h1>
        <p className="page-lead mx-auto mt-4">
          Whatever you were looking for isn&apos;t here — it may have moved, or the link might be off.
        </p>
        <Link href={ROUTES.home} className="btn-pill btn-pill-dark mt-9 inline-flex">
          Back to Quancis
        </Link>
      </div>
    </div>
  );
}
