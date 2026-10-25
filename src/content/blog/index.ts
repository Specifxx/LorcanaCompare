import type { Post } from "./types";
import { post as hyperia } from "./hyperia-city-prices";
import { post as expensive } from "./most-expensive";
import { post as inkdark } from "./into-the-inkdark";
import { post as whereToBuy } from "./where-to-buy";

export const POSTS: Post[] = [hyperia, expensive, inkdark, whereToBuy];
