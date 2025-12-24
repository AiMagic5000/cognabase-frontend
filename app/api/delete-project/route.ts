import { NextRequest, NextResponse } from 'next/server';

const VALID_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const N8N_TIMEOUT = 30000; // 30 seconds

export async function POST(request: NextRequest) {
  try {
    // Validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400 }
      );
    }

    const { projectId } = await request.json();

    // Validate projectId format
    if (!projectId || typeof projectId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    if (!VALID_UUID_REGEX.test(projectId)) {
      return NextResponse.json(
        { error: 'Invalid project ID format' },
        { status: 400 }
      );
    }

    // Validate environment variables
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const authSecret = process.env.N8N_AUTH_SECRET;

    if (!webhookUrl || !authSecret) {
      console.error('Missing n8n configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Call n8n webhook with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT);

    try {
      const response = await fetch(`${webhookUrl}/delete-project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Secret': authSecret,
        },
        body: JSON.stringify({ projectId }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`n8n error [${response.status}]:`, errorText);
        throw new Error(`Workflow failed: ${response.status}`);
      }

      return NextResponse.json({ success: true });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        throw new Error('Webhook request timeout');
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Delete API Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to delete project' },
      { status: 500 }
    );
  }
}
