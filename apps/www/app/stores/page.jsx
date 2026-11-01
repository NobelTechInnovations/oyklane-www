import { getSite, SITE_URL } from "../site-data";
import { APP_URL } from "../components/site";
import { Icon } from "../components/Icon";

export const metadata = {
  title: { absolute: "Stores on oyklane — Indian brands selling online" },
  description: "Discover Indian brands that run their online stores on oyklane — fashion, jewellery, food, home and more. Visit their stores and shop direct.",
  alternates: { canonical: "/stores" },
};

// Shown until Super admin ▸ Website lists stores: brands already live.
const FALLBACK = [
  { name: "The Laxmira Studio", url: "https://laxmira.net", what: "Designer clothing, for sale and for rent" },
  { name: "Sukirti Spices", url: "https://sukirti-spices.oyklane.com", what: "Indian spices" },
  { name: "Dorangi", url: "https://dorangi.oyklane.com", what: "" },
];

/** oyklane.com/stores: brands selling on oyklane, each linking to its own
 * store — shoppers find them here, and search engines follow the links. */
export default async function StoresPage() {
  const site = await getSite();
  const stores = site.showcase.length ? site.showcase : FALLBACK;
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Stores on oyklane",
    url: `${SITE_URL}/stores`,
    itemListElement: stores.map((s, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "OnlineStore", name: s.name, url: s.url, ...(s.description && { description: s.description }) } })),
  };
  return (
    <>
      <section className="wrap page-hero">
        <div>
          <h1 className="h1">Stores on oyklane</h1>
          <p className="lead">Indian brands that sell online with oyklane. Visit them and shop direct — every order goes straight to the brand.</p>
        </div>
      </section>
      <section className="section section--tight">
        <div className="wrap">
          <ul className="stores">
            {stores.map((s) => (
              <li key={s.url} className="store-card">
                {s.image ? <img src={s.image} alt="" width="1200" height="630" loading="lazy" className="store-card__img" /> : <span className="store-card__img store-card__img--blank" aria-hidden="true">{s.name.slice(0, 1)}</span>}
                <div className="store-card__body">
                  <h2 className="h3">{s.name}</h2>
                  {(s.what || s.description) && <p>{s.what || s.description}</p>}
                  <a href={s.url} className="link-arrow" target="_blank" rel="noopener">
                    Visit {s.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} <Icon name="arrow-up-right" weight="regular" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <div className="stores__cta">
            <p>
              <b>Your brand could be here.</b> Open your store on oyklane and get listed.
            </p>
            <a href={`${APP_URL}/register`} className="btn btn--primary">
              Start your free trial
            </a>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
    </>
  );
}
