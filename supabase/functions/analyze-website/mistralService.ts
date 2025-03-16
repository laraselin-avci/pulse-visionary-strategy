
import { corsHeaders, createErrorResponse } from "./utils.ts";

// Extract topics using Mistral AI
export async function analyzeSiteWithMistral(websiteUrl: string): Promise<any[]> {
  const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
  
  if (!mistralApiKey) {
    throw new Error('Mistral API key is missing');
  }

  console.log('Sending request to Mistral AI');

  // Create a prompt for Mistral
  const systemPrompt = `
You are an expert policy analyst specialized in identifying regulatory topics and policy discussions that might be relevant to a company based on their website.
Analyze the provided website URL and extract 10 relevant policies, regulatory topics, or public affairs discussions that might impact this company.
For each topic, provide:
1. A concise name (3-5 words)
2. A detailed description (2-3 sentences) explaining why this topic is relevant to the company

Format your response as a valid JSON array with objects containing "name" and "description" fields.
Example:
[
  {
    "name": "Data Privacy Regulations",
    "description": "Laws and regulations governing the collection, storage, and processing of personal data. This is relevant because the company collects user information through their website."
  },
  {
    "name": "Industry-specific topic",
    "description": "Description of why this is relevant to the company..."
  }
]

Ensure your response is ONLY the JSON array, with no additional text.
  `;

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${mistralApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral-large-latest',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analyze this website: ${websiteUrl}` }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Mistral API error:', errorText);
    throw new Error('Failed to analyze website with Mistral AI');
  }

  const data = await response.json();
  console.log('Received response from Mistral AI');
  
  return parseTopicsFromMistral(data);
}

// Parse the response from Mistral AI
function parseTopicsFromMistral(mistralResponse: any): any[] {
  try {
    const content = mistralResponse.choices[0].message.content;
    console.log('Raw content from Mistral:', content);
    
    // Parse JSON from the response
    // First, try to parse directly
    try {
      const extractedTopics = JSON.parse(content);
      
      // Validate the structure
      if (!Array.isArray(extractedTopics)) {
        throw new Error('Mistral response is not a valid array');
      }
      
      console.log(`Successfully extracted ${extractedTopics.length} topics`);
      return extractedTopics;
    } catch (e) {
      // If direct parsing fails, try to extract JSON from the text
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const extractedTopics = JSON.parse(jsonMatch[0]);
        
        if (!Array.isArray(extractedTopics)) {
          throw new Error('Extracted content is not a valid array');
        }
        
        console.log(`Successfully extracted ${extractedTopics.length} topics`);
        return extractedTopics;
      } else {
        throw new Error('Could not extract valid JSON from Mistral response');
      }
    }
  } catch (error) {
    console.error('Error parsing Mistral response:', error);
    throw new Error('Failed to parse topics from Mistral AI response');
  }
}
