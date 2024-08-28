export class PostEntity {
  id: string;
  title: string;
  imageUrl: string;
  content?: string;
  featured?: boolean;
  totalVisits?: number;
  tags?: string[];
  createdAt: Date;
}
