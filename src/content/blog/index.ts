import type { Post } from "./types";
import { post as hyperia } from "./hyperia-city-prices";
import { post as expensive } from "./most-expensive";
import { post as inkdark } from "./into-the-inkdark";
import { post as whereToBuy } from "./where-to-buy";
import { post as boxOrSingles } from "./box-or-singles";
import { post as cardValue } from "./card-value";

export const POSTS: Post[] = [hyperia, expensive, inkdark, whereToBuy, boxOrSingles, cardValue];
