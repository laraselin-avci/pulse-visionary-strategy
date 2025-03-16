
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createErrorResponse, createSuccessResponse } from "./utils.ts";
import { analyzeSiteWithMistral } from "./mistralService.ts";
import { saveTopicsToSupabase } from "./supabaseService.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteUrl } = await req.json();
    console.log('Analyzing website:', websiteUrl);

    if (!websiteUrl) {
      return createErrorResponse('Website URL is required', 400);
    }

    // 1. Analyze the website with Mistral AI to extract topics
    let extractedTopics;
    try {
      extractedTopics = await analyzeSiteWithMistral(websiteUrl);
    } catch (error) {
      console.error('Error during Mistral analysis:', error.message);
      return createErrorResponse(error.message);
    }

    // 2. Save the extracted topics to Supabase
    let addedTopics = [];
    try {
      addedTopics = await saveTopicsToSupabase(extractedTopics, websiteUrl);
    } catch (error) {
      console.error('Error during Supabase storage:', error.message);
      // Continue with process even if some topics failed to be inserted
      // We'll still return the extracted topics
    }

    // 3. Return the results
    return createSuccessResponse({ 
      topics: extractedTopics, 
      addedTopics,
      sourceWebsite: websiteUrl // Return the source website to be stored in localStorage
    });

  } catch (error) {
    console.error('Error in analyze-website function:', error);
    return createErrorResponse(error.message);
  }
});
