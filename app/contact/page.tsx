import ProfilePage from '@/components/ProfilePage';
import {socialProfiles} from '@/lib/site';
export const metadata={title:'Contact'};
export default function Contact(){return <ProfilePage label="CONTACT" title="Start a conversation" description="For research conversations, collaboration, and thoughtful questions about mobile security.">
  <div className="contact-grid">{socialProfiles.map(profile=><a href={profile.url} target="_blank" rel="noopener noreferrer" key={profile.name} className="contact-card" aria-label={`${profile.name} (opens in a new tab)`}><span className="eyebrow">{profile.name}</span><h2>{profile.description} ↗</h2></a>)}</div>
</ProfilePage>}
