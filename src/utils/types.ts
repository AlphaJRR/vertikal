export interface Creator {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  stats: {
    fans: string;
    series: string;
    views?: string;
  };
  type: 'creator' | 'network';
  subPrice?: string;
  isFounding50: boolean;
  projects?: Project[];
  products?: Product[];
  bts?: string[];
  jobs?: Job[];
  roster?: string[];
}

export interface Project {
  title: string;
  type: 'SERIES' | 'DOCU' | 'ORIGINAL';
  img: string;
  creatorName?: string;
  creatorAvatar?: string;
}

export interface Product {
  title: string;
  price: string;
  sold: string;
}

export interface Job {
  title: string;
  proj: string;
  rate: string;
  type: string;
}

export interface Show {
  id: string;
  title: string;
  type?: string;
  img?: string;
  creatorId?: string;
  [key: string]: unknown;
}

export interface Chat {
  id: number;
  userId: string;
  lastMsg: string;
  time: string;
  unread: boolean;
}


