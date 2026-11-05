import { withBase } from './utils/paths';

// Central place for site-wide placeholders.
// TODO: replace with your real personal details before publishing.
export const SITE = {
  title: 'puja.sec',
  tagline: 'Independent security research, vulnerability analysis & tooling',
  description:
    'A personal cybersecurity research publication covering vulnerability research, CVE analysis, reverse engineering, and open-source security tooling.',
  url: 'https://cyberpooja.github.io/',
  author: {
    name: 'Pooja',
    bio: 'Security researcher focused on Android, web/API, and AI security. I publish original vulnerability research, root-cause analysis, and open-source tooling.',
    avatar: withBase('/uploads/avatar-placeholder.svg'),
  },
};

export const NAV_LINKS = [
  { href: withBase('/'), label: 'Home' },
  { href: withBase('/research/'), label: 'Security Research' },
  { href: withBase('/blog/'), label: 'Blog' },
  { href: withBase('/tools/'), label: 'Tools & Projects' },
  { href: withBase('/about/'), label: 'About' },
  { href: withBase('/contact/'), label: 'Contact' },
];

// Social profiles shared across the homepage, footer, and contact page.
export const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/cyberpooja', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pooja-pawar-1757b31aa/', icon: 'linkedin' },
  { label: 'Medium', href: 'https://medium.com/@pujapawar', icon: 'medium' },
  { label: 'HackerOne', href: 'https://hackerone.com/poojapawar?type=user', icon: 'hackerone' },
  { label: 'X / Twitter', href: 'https://x.com/Cyberpoooja', icon: 'twitter' },
  { label: 'Email', href: 'mailto:poojapawar23522@gmail.com', icon: 'mail' },
];
