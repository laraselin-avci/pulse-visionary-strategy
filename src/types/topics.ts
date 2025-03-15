
export interface Topic {
  id: string;
  name: string;
  category?: string; // Make category optional since it's not in the DB schema
  description: string;
  following: boolean;
  is_public?: boolean;
  keywords?: string[]; // Add keywords field as it's in the DB schema
}

export interface EditableTopicData {
  name: string;
  category?: string; // Make category optional
  description: string;
}
