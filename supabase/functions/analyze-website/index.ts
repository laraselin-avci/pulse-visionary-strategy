
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteUrl } = await req.json();
    console.log('Analyzing website:', websiteUrl);

    if (!websiteUrl) {
      return new Response(
        JSON.stringify({ error: 'Website URL is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

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

    console.log('Sending request to Mistral AI');

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
      return new Response(
        JSON.stringify({ error: 'Failed to analyze website with Mistral AI' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    console.log('Received response from Mistral AI');
    
    let extractedTopics;
    try {
      const content = data.choices[0].message.content;
      console.log('Raw content from Mistral:', content);
      
      // Parse JSON from the response
      // First, try to parse directly
      try {
        extractedTopics = JSON.parse(content);
      } catch (e) {
        // If direct parsing fails, try to extract JSON from the text
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          extractedTopics = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract valid JSON from Mistral response');
        }
      }
      
      // Validate the structure
      if (!Array.isArray(extractedTopics)) {
        throw new Error('Mistral response is not a valid array');
      }
      
      console.log(`Successfully extracted ${extractedTopics.length} topics`);
    } catch (error) {
      console.error('Error parsing Mistral response:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to parse topics from Mistral AI response' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Add topics to Supabase
    const temporaryUserId = '00000000-0000-0000-0000-000000000000'; // Same fixed ID used in useTopicData
    const addedTopics = [];

    try {
      console.log('Adding topics to Supabase');
      
      // Make a single request to Supabase to insert all topics
      const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': `${supabaseServiceKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(
          extractedTopics.map(topic => ({
            name: topic.name,
            description: topic.description,
            is_public: false,
            keywords: [], // Default empty array
            user_id: temporaryUserId
          }))
        )
      });

      if (!supabaseResponse.ok) {
        const error = await supabaseResponse.text();
        console.error('Error adding topics to Supabase:', error);
        throw new Error('Failed to add topics to Supabase');
      }

      addedTopics = await supabaseResponse.json();
      console.log(`Successfully added ${addedTopics.length} topics to Supabase`);
    } catch (error) {
      console.error('Error adding topics to Supabase:', error);
      // Continue with process even if some topics failed to be inserted
    }

    return new Response(
      JSON.stringify({ topics: extractedTopics, addedTopics }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in analyze-website function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
