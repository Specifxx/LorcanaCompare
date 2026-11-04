import type { Post } from "./types";
import { post as hyperia } from "./hyperia-city-prices";
import { post as expensive } from "./most-expensive";
import { post as inkdark } from "./into-the-inkdark";
import { post as whereToBuy } from "./where-to-buy";
import { post as boxOrSingles } from "./box-or-singles";
import { post as cardValue } from "./card-value";
import { post as giftGuide } from "./gift-guide";
import { post as franchises } from "./franchises";
import { SET_POSTS } from "./set-chase";
import { post as iconicEra } from "./iconic-era";

export const POSTS: Post[] = [iconicEra, giftGuide, franchises, hyperia, expensive, inkdark, whereToBuy, boxOrSingles, cardValue, ...SET_POSTS];
