export interface IRelease {
  id: number; poster: string; image: string; year: string; genres: string;
  country: string; studio: string; description: string;
  category: { id: number; name: string };
  rating: number; grade: number;
  status: { id: number; name: string };
  duration: number; season: number;
  title_original: string; title_ru: string; title_alt: string;
  episodes_released: number; episodes_total: number;
  vote_count: number; favorites_count: number;
  watching_count: number; completed_count: number;
  age_rating: number; is_adult: boolean;
  screenshot_images: string[];
  recommended_releases: IRelease[];
  comment_count: number;
}

export interface IEpisode {
  id: number; position: number; name: string;
  url: string; iframe: boolean; addedDate: number;
  is_watched: boolean;
}

export interface IDubber {
  id: number; name: string; icon: string;
  is_sub: boolean; episode_count: number;
}

export interface ISource {
  id: number; name: string; episode_count: number;
}

export interface IProfile {
  id: number; login: string; avatar: string;
  about: string; gender: number;
}

export interface IApiResponse<T = any> {
  code: number;
  [key: string]: T | number;
}
