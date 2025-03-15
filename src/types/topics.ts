
export interface Topic {
  id: string;
  name: string;
  category: string;
  description: string;
  following: boolean;
  is_public?: boolean;
}

export interface EditableTopicData {
  name: string;
  category: string;
  description: string;
}
