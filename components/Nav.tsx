import { getSiteSettings } from '@/lib/content';
import { NavClient } from './NavClient';

export function Nav() {
  const { nav, site } = getSiteSettings();
  return <NavClient nav={nav} site={site} />;
}
