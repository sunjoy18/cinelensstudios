import { getSiteSettings } from '@/lib/content';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  const settings = getSiteSettings();
  return <ContactForm settings={settings} />;
}
