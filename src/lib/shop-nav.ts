// The shopping half of the navigation (owner, 2026-11-09: "a collector or someone deep in a space wants to navigate it fast"):
// a card player browses by the game's own dimensions (SITE.cardHubs: ink colour, card type, franchise…), by rarity, by set
// and by sealed product type. The header's dropdowns (components/HeaderMenus.tsx), the rail's "Shop by" groups
// (lib/nav.ts navGroups `shop`) and the phone menu (components/MobileMenu.tsx) all read this ONE list. It reads only the
// loaders the hub pages already read (lib/hubs.ts), and every link is a hub that exists (a hub exists only with products),
// so there is no dead end and no new page, query or cache entry. Server-side only: lib/nav.ts stays free of data.
import { SITE } from "@/site.config";
import { products, sets } from "@/lib/data";
import { attrFacets, rarityHubs, sealedHubs } from "@/lib/hubs";
import type { NavGroup, NavLink } from "@/lib/nav";

export interface MenuColumn { title: string; href: string; links: NavLink[] }
export interface MenuItem { label: string; href: string; also?: string[]; columns: MenuColumn[] }
export interface ShopNav { menus: MenuItem[]; groups: NavGroup[] }

const MENU_LINKS = 8;
const RAIL_LINKS = 10;
const cap = (list: NavLink[], n: number, all: NavLink): NavLink[] => (list.length > n ? [...list.slice(0, n), all] : list);

let memo: { at: unknown; v: ShopNav } | null = null;
export function shopNav(): ShopNav {
  const at = products();
  if (memo && memo.at === at) return memo.v;
  const v = buildShopNav();
  memo = { at, v };
  return v;
}

function buildShopNav(): ShopNav {
  const facets = attrFacets();
  const rarities = rarityHubs();
  const sealed = sealedHubs();
  const listed = sets().filter((s) => s.productCount > 0);
  const released = listed.filter((s) => !s.upcoming && s.productCount > 20);

  // One column per dimension, in the order a player thinks: the game's own first facet (ink, colour), rarity, then the rest.
  const dims: { key: string; title: string; href: string; links: NavLink[]; all: NavLink }[] = facets.map((f) => ({
    key: f.cfg.facet,
    title: `By ${f.cfg.noun[0]}`,
    href: `/cards/${f.cfg.facet}`,
    links: f.hubs.map((h) => ({ href: `/cards/${f.cfg.facet}/${h.slug}`, label: h.label })),
    all: { href: `/cards/${f.cfg.facet}`, label: `All ${f.hubs.length} ${f.cfg.noun[1]}` },
  }));
  if (rarities.length > 1) {
    dims.splice(Math.min(1, dims.length), 0, {
      key: "rarity",
      title: "By rarity",
      href: "/cards",
      links: rarities.map((h) => ({ href: `/cards/rarity/${h.slug}`, label: h.label })),
      all: { href: "/cards", label: "All cards" },
    });
  }

  // Long lists (forty franchises) after the short ones, so the four dropdown columns are the dimensions a player filters by.
  const first = dims.slice(0, 1);
  dims.splice(0, dims.length, ...first, ...dims.slice(1).sort((a, b) => Number(a.links.length > 25) - Number(b.links.length > 25)));

  const setLinks: NavLink[] = released.map((s) => ({ href: `/sets/${s.slug}`, label: s.name }));
  const sealedLinks: NavLink[] = sealed.map((h) => ({ href: `/sealed/${h.slug}`, label: h.label }));

  const menus: MenuItem[] = [
    { label: "Cards", href: "/cards", also: ["/card"], columns: dims.slice(0, 4).map((d) => ({ title: d.title, href: d.href, links: cap(d.links, MENU_LINKS, d.all) })) },
    {
      label: "Sets",
      href: "/sets",
      columns: [
        { title: "Newest sets", href: "/sets", links: cap(setLinks, 10, { href: "/sets", label: `All ${listed.length} sets` }) },
        { title: "Coming soon", href: "/preorders", links: [{ href: "/preorders", label: "Pre-orders and releases" }] },
      ],
    },
  ];
  if (sealedLinks.length) menus.push({ label: "Sealed", href: "/sealed", columns: [{ title: "By product type", href: "/sealed", links: [...sealedLinks, { href: "/sealed", label: "All sealed" }] }] });

  const groups: NavGroup[] = dims.map((d, i) => ({ title: d.title.replace(/^By /, "Shop by "), links: [...(i === 0 ? [{ href: "/cards", label: "All cards" }] : []), ...cap(d.links, RAIL_LINKS, d.all)] }));
  groups.push({ title: "Sets", links: cap(setLinks, 10, { href: "/sets", label: "Every set" }) });
  if (sealedLinks.length) groups.push({ title: "Sealed by type", links: [...sealedLinks, { href: "/sealed", label: "All sealed" }] });
  return { menus, groups };
}
