import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['vorstandsmitglied', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const folder = (formData.get('folder') as string) || 'uploads'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  // Validate file type
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
  }

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  const r2AccountId = process.env.R2_ACCOUNT_ID!
  const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID!
  const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY!
  const r2BucketName = process.env.R2_BUCKET_NAME!
  const r2PublicUrl = process.env.R2_PUBLIC_URL!

  const ext = file.name.split('.').pop()
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  // Sign and upload to R2 via S3-compatible API
  const bytes = await file.arrayBuffer()
  const uploadUrl = `https://${r2AccountId}.r2.cloudflarestorage.com/${r2BucketName}/${key}`

  // Use AWS Signature V4 (manual implementation for edge runtime)
  const { signedHeaders, signature, datetime, date } = await signR2Request({
    method: 'PUT',
    url: uploadUrl,
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
    region: 'auto',
    contentType: file.type,
    body: bytes,
  })

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'X-Amz-Date': datetime,
      'Authorization': `AWS4-HMAC-SHA256 Credential=${r2AccessKeyId}/${date}/auto/s3/aws4_request, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      'X-Amz-Content-Sha256': await hexDigest(bytes),
    },
    body: bytes,
  })

  if (!uploadRes.ok) {
    const text = await uploadRes.text()
    console.error('R2 upload error:', text)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const url = `${r2PublicUrl}/${key}`
  return NextResponse.json({ url })
}

async function hexDigest(data: ArrayBuffer | Uint8Array): Promise<string> {
  const buf = data instanceof Uint8Array ? new Uint8Array(data.buffer as ArrayBuffer, data.byteOffset, data.byteLength).buffer as ArrayBuffer : data as ArrayBuffer
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function hmac(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const rawKey = key instanceof Uint8Array ? key.buffer : key
  const k = await crypto.subtle.importKey('raw', rawKey as ArrayBuffer, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return crypto.subtle.sign('HMAC', k, new TextEncoder().encode(data))
}

async function signR2Request({ method, url, accessKeyId, secretAccessKey, region, contentType, body }: {
  method: string; url: string; accessKeyId: string; secretAccessKey: string;
  region: string; contentType: string; body: ArrayBuffer;
}) {
  const now = new Date()
  const datetime = now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15) + 'Z'
  const date = datetime.slice(0, 8)

  const parsedUrl = new URL(url)
  const host = parsedUrl.host
  const path = parsedUrl.pathname

  const payloadHash = await hexDigest(body)
  const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${datetime}\n`
  const signedHeaders = 'content-type;host;x-amz-content-sha256;x-amz-date'
  const canonicalRequest = [method, path, '', canonicalHeaders, signedHeaders, payloadHash].join('\n')
  const credentialScope = `${date}/${region}/s3/aws4_request`
  const stringToSign = `AWS4-HMAC-SHA256\n${datetime}\n${credentialScope}\n${await hexDigest(new TextEncoder().encode(canonicalRequest))}`

  const enc = (s: string) => new TextEncoder().encode(s)
  const kDate = await hmac(enc(`AWS4${secretAccessKey}`), date)
  const kRegion = await hmac(kDate, region)
  const kService = await hmac(kRegion, 's3')
  const kSigning = await hmac(kService, 'aws4_request')
  const sigBuf = await hmac(kSigning, stringToSign)
  const signature = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('')

  return { signedHeaders, signature, datetime, date }
}
