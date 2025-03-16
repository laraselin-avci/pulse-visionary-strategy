
// Common headers for CORS support
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to create a standardized error response
export function createErrorResponse(message: string, status: number = 500) {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status: status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

// Helper to create a standardized success response
export function createSuccessResponse(data: any) {
  return new Response(
    JSON.stringify(data),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
