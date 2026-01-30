# API Routes - Next.js App Router

## Estrutura de API Routes

### File-based Routing
```
/app
└── /api
    ├── /contact
    │   └── route.ts      → POST /api/contact
    ├── /projects
    │   └── route.ts      → GET /api/projects
    └── /subscribe
        └── route.ts      → POST /api/subscribe
```

## Contact Form API (app/api/contact/route.ts)

### POST Handler com Validation
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema de validação
const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres'),
  subject: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validação com Zod
    const validatedData = contactSchema.parse(body);

    // TODO: Enviar email ou salvar no banco
    console.log('Contact form submission:', validatedData);

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { success: true, message: 'Mensagem enviada com sucesso!' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
```

## Projects API (app/api/projects/route.ts)

### GET Handler
```typescript
import { NextResponse } from 'next/server';
import { projects } from '@/lib/projects';

export async function GET() {
  return NextResponse.json(projects);
}

// Com query params
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');

  const filtered = category
    ? projects.filter(p => p.category === category)
    : projects;

  return NextResponse.json(filtered);
}
```

## Validation Patterns

### Zod Schema Reusable
```typescript
// lib/schemas/contact.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Nome muito curto')
    .max(100, 'Nome muito longo'),
  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  message: z.string()
    .min(10, 'Mensagem muito curta')
    .max(1000, 'Mensagem muito longa'),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido')
    .optional(),
  subject: z.enum(['general', 'project', 'support'])
    .default('general')
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

## Error Handling

### Standard Error Response
```typescript
type ErrorResponse = {
  success: false;
  message: string;
  errors?: Array<{ path: string; message: string }>;
};

function errorResponse(
  message: string,
  status: number = 500,
  errors?: any[]
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, message, errors },
    { status }
  );
}

// Uso
return errorResponse('Validation failed', 400, validationErrors);
```

## Rate Limiting

### Simple Rate Limiter
```typescript
// lib/rateLimit.ts
const rateLimit = new Map<string, number[]>();

export function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];

  // Filtrar requests dentro da janela
  const recentRequests = requests.filter(time => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}

// Uso na API route
export async function POST(request: NextRequest) {
  const ip = request.ip || 'unknown';

  if (!checkRateLimit(ip, 5, 60000)) {
    return errorResponse('Too many requests', 429);
  }

  // Processar requisição...
}
```

## CORS Configuration

### Enable CORS
```typescript
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

// Handle OPTIONS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
```

## Environment Variables

### .env.local
```bash
# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# API Keys
RECAPTCHA_SECRET_KEY=your-secret-key

# Database (futuro)
DATABASE_URL=postgresql://...
```

### Uso Seguro
```typescript
// Validar env vars na inicialização
const requiredEnvVars = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required env var: ${varName}`);
  }
});
```

## Email Integration (Futuro)

### Nodemailer Setup
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

export async function sendContactEmail(data: ContactFormData) {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: 'contato@liberblock.com',
    subject: `[Contact] ${data.subject}`,
    html: `
      <h2>Nova mensagem de ${data.name}</h2>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${data.message}</p>
    `
  });
}
```

## Security Best Practices

1. **Input Validation:** Sempre validar com Zod/Joi
2. **Rate Limiting:** Implementar limite de requisições
3. **CORS:** Configurar origins permitidas
4. **Sanitization:** Sanitizar inputs antes de processar
5. **Error Messages:** Não expor detalhes internos
6. **HTTPS Only:** Forçar HTTPS em produção
7. **Environment Vars:** Nunca commitar secrets
8. **SQL Injection:** Usar ORMs/prepared statements

## Testing API Routes

### Unit Test Example
```typescript
import { POST } from './route';
import { NextRequest } from 'next/server';

describe('POST /api/contact', () => {
  it('should validate required fields', async () => {
    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

## Atualização
Última modificação: 2026-01-30
Rotas ativas: /api/contact (POST)
