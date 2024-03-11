export interface IUser {
  added_by: any;
  _id?: string;
  name: string;
  email: string;
  password: string;
  token?: string;
}

export interface ICases {
  _id?: string;
  title: string;
  year: string;
  timeframe: string;
  main_service: string;
  extra_service: string;
  return_on_investment: string;
  description: string;
  cover_image: string;
  token?: string;
}

export interface ICategories {
  _id?: string;
  name: string;
}

export interface IServices {
  _id?: string;
  slug: string;
  title: string;
  short_description: string;
  long_description: string;
  cover_image: string;
  icon: string;
  token?: string;
}

export interface IBlogs {
  _id?: string;
  title: string;
  short_description: string;
  long_description: string;
  cover_image: string;
  category: { name: string };
  slug: string;
  token?: string;
  created_at: string;
  created_by: { name: string };
  comments?: IComments[];
}

export interface IUpdateBlogs {
  _id?: string;
  title: string;
  short_description: string;
  long_description: string;
  cover_image: string;
  slug: string;
  token?: string;
}

export interface IComments {
  _id?: string;
  name: string;
  message: string;
  created_at: string;
  blog: { _id?: string; title: string; slug: string };
  replies?: IComments[];
}
