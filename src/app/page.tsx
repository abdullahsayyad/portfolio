import { IdentityPanel } from "@/components/left/IdentityPanel";
import { SocialLinks } from "@/components/left/SocialLinks";
import { ContentPanel } from "@/components/right/ContentPanel";
import { navSections, portfolio } from "@/data/portfolio";

export default function Home() {
  const { profile, projects, products, contact, lists } = portfolio;

  return (
    // 743 / 769 is the split either side of the vertical rule in the design.
    <main className="lg:grid lg:h-screen lg:grid-cols-[743fr_769fr]">
      <IdentityPanel profile={profile} />
      <ContentPanel
        sections={navSections}
        projects={projects}
        products={products}
        contact={contact}
        lists={lists}
      />

      {/* Mobile only: the socials sit at the true bottom of the page, below
          Contact. On lg+ they live in the fixed left panel instead. */}
      <footer className="flex justify-center px-gutter pt-4 pb-14 lg:hidden">
        <SocialLinks socials={profile.socials} />
      </footer>
    </main>
  );
}
