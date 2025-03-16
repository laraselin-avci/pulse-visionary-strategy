
// Fixed user ID for topics
export const temporaryUserId = '00000000-0000-0000-0000-000000000000';

// Add topics to Supabase
export async function saveTopicsToSupabase(topics: any[], websiteUrl: string): Promise<any[]> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase credentials are missing');
  }

  console.log('Adding topics to Supabase');
  
  // Create the fixed user first if it doesn't exist
  await ensureTemporaryUserExists(supabaseUrl, supabaseServiceKey);

  // Now insert the topics
  const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/topics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': `${supabaseServiceKey}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(
      topics.map(topic => ({
        name: topic.name,
        description: topic.description,
        is_public: false,
        keywords: [], // Default empty array
        user_id: temporaryUserId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: null,
        topics_source: websiteUrl // Store the source website URL
      }))
    )
  });

  if (!supabaseResponse.ok) {
    const error = await supabaseResponse.text();
    console.error('Error adding topics to Supabase:', error);
    throw new Error('Failed to add topics to Supabase');
  }

  const addedTopics = await supabaseResponse.json();
  console.log(`Successfully added ${addedTopics.length} topics to Supabase`);
  
  return addedTopics;
}

// Ensure the temporary user exists in the database
async function ensureTemporaryUserExists(supabaseUrl: string, supabaseServiceKey: string): Promise<void> {
  // Check if user exists first
  const checkUserResponse = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${temporaryUserId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'apikey': `${supabaseServiceKey}`
    }
  });
  
  const existingUsers = await checkUserResponse.json();
  
  // If user doesn't exist, create it first
  if (!existingUsers || existingUsers.length === 0) {
    console.log('Creating temporary user for topics');
    const createUserResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': `${supabaseServiceKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        id: temporaryUserId,
        email: 'temporary@example.com',
        name: 'Temporary User',
        created_at: new Date().toISOString()
      })
    });
    
    if (!createUserResponse.ok) {
      const error = await createUserResponse.text();
      console.error('Error creating temporary user:', error);
      // Continue anyway, the user might exist in a way we can't see
    } else {
      console.log('Successfully created temporary user');
    }
  }
}
