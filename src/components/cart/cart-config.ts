// The one per-site value of the cart list (src/lib/cart-list.ts): the name stores see in
// utm_source and the cart attribute. Engine code, so it reads the site's own config.
import { SITE } from "@/site.config";

export const CART_SITE = SITE.domain;
