export interface Release {
  tag_name: string;
  html_url: string;
  prerelease: boolean;
  published_at: string;
  author: {
    login: string;
    avatar_url: string;
  };
  assets: {
    name: string;
    size: number;
    download_count: number;
    updated_at: string;
    browser_download_url: string;
  }[];
}

export interface SearchParams {
  username: string;
  repository: string;
  page: number;
  perPage: number;
} 