
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');

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
    const { query, insights } = await req.json();

    if (!query || !insights || insights.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query and insights are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Processing query:', query);
    console.log('Number of insights provided:', insights.length);

    // Format insights data into a clean text representation
    const insightsText = insights.map((insight: any) => {
      return `
INSIGHT ID: ${insight.id}
TITLE: ${insight.title}
DESCRIPTION: ${insight.description}
SOURCE: ${insight.source}
PRIORITY: ${insight.priority}
DATE: ${insight.date}
TOPIC: ${insight.topic}
      `;
    }).join('\n\n');

    // Create a prompt for Mistral
    const systemPrompt = `
You are a specialized AI that analyzes regulatory insights and answers questions about them.
You have access to a set of regulatory insights that you can reference in your answers.
Always provide specific references to the insights you're using in your answer.
Be factual, precise, and only use the information provided in the insights.
If the information to answer the question is not available in the insights, clearly state that.
    `;

    const userPrompt = `
I want you to analyze the following regulatory insights and answer my question:

${insightsText}

My question is: ${query}
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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Mistral API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to get response from Mistral AI' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in regulatory-assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
