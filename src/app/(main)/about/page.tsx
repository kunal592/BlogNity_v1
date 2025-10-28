import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTeam } from '@/lib/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AboutPage() {
  return (
    <div className="container mx-auto space-y-12">
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Empowering Voices, Connecting Minds
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
          BlogNity is more than a platform; it's a community dedicated to the art of writing and the joy of discovery. We provide the tools for creators to share their stories and the space for readers to find inspiration.
        </p>
      </section>
      
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Founded in 2023, BlogNity was born from a simple idea: to create a beautiful, powerful, and intuitive space for writers and readers. We saw a need for a platform that values quality content and elegant design, free from the noise and clutter of traditional social media. Our journey is one of passion for technology and storytelling, culminating in the premium experience you see today.
          </p>
        </div>
        <div className="relative h-80 rounded-lg overflow-hidden">
            <Image src="https://picsum.photos/seed/about1/800/600" alt="Team working" layout="fill" objectFit="cover" data-ai-hint="team collaboration" />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 text-center">
        <Card>
          <CardHeader>
            <CardTitle>For Readers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Discover high-quality content tailored to your interests. Follow your favorite authors and build a personalized feed of inspiration and knowledge.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Writers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Focus on your craft with our distraction-free editor and powerful publishing tools. Grow your audience and connect with a community that values your voice.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">To be the leading platform for thoughtful content and meaningful connections, fostering a world where every story has a chance to make an impact.</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Meet the Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockTeam.map((member) => (
            <Card key={member.name} className="text-center">
              <CardContent className="p-6">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="text-xs text-muted-foreground mt-2">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
