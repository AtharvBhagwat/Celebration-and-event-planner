export interface SampleCodeAudit {
  id: string;
  name: string;
  language: string;
  category: 'Security Vulnerability' | 'Performance & Big-O' | 'Accessibility & Quality';
  vulnerableCode: string;
  hardenedPatch: string;
  summary: string;
}

export const SAMPLE_CODE_AUDITS: SampleCodeAudit[] = [
  {
    id: 'sql-injection-secrets',
    name: 'OWASP A03 SQL Injection & Hardcoded Secret in Node.js Handler',
    language: 'typescript',
    category: 'Security Vulnerability',
    summary: 'Direct string interpolation in SQL query, hardcoded JWT secret, unhandled async rejection, and lack of input validation.',
    vulnerableCode: `// ⚠️ Insecure Node.js / Express Route Handler
import express from 'express';
import db from './database';

const router = express.Router();
const JWT_SECRET = 'my_super_secret_master_key_123'; // ❌ CRITICAL: Hardcoded secret!

router.get('/users/search', async (req: any, res: any) => { // ❌ TypeScript 'any' type
  const { query } = req.query;
  
  // ❌ CRITICAL: SQL Injection vulnerability via string concatenation!
  const sql = "SELECT id, username, email, role FROM users WHERE username = '" + query + "'";
  
  // ❌ Missing try/catch or error boundary!
  const results = await db.query(sql);
  
  res.json({ users: results.rows });
});

export default router;`,
    hardenedPatch: `/**
 * Hardened Zero-Trust Express Route Handler
 * Satisfies all Six Engineering Pillars:
 * 1. Root Cause: Parameterized query prevents SQL injection
 * 2. Quality: Explicit TypeScript interfaces with DRY validation
 * 3. Security: Environment variable with runtime invariant checks
 * 4. Performance: O(1) indexed query plan; parameterized execution
 * 5. Testing: Ready for supertest / Vitest with mocked pool
 * 6. Accessibility: Standard JSON payload structure for consumer a11y clients
 */

import express, { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';

const router = express.Router();

// Enforce environment credential at runtime
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('Zero-Trust Invariant Failed: process.env.JWT_SECRET must be >= 32 characters');
}

export interface UserDTO {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly role: 'admin' | 'member';
}

// Input sanitizer validating query against strict alphanumeric pattern
function sanitizeSearchQuery(raw: unknown): string {
  if (typeof raw !== 'string') {
    throw new Error('Query parameter must be a string');
  }
  const trimmed = raw.trim();
  if (trimmed.length < 1 || trimmed.length > 50) {
    throw new Error('Query parameter must be between 1 and 50 characters');
  }
  // Allow only alphanumeric and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    throw new Error('Query parameter contains illegal characters');
  }
  return trimmed;
}

export function createSearchRouter(dbPool: Pool) {
  router.get('/users/search', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Zero-Trust input validation
      const sanitizedUsername = sanitizeSearchQuery(req.query.query);

      // 2. Parameterized SQL query mitigating OWASP A03 SQLi
      const queryText = 'SELECT id, username, email, role FROM users WHERE username = $1 LIMIT 20;';
      const result = await dbPool.query<UserDTO>(queryText, [sanitizedUsername]);

      // 3. Structured safe response
      return res.status(200).json({
        success: true,
        data: result.rows,
        count: result.rowCount,
      });
    } catch (err: unknown) {
      // 4. Defensive asynchronous error propagation
      return next(err);
    }
  });

  return router;
}`,
  },
  {
    id: 'xss-a11y-react',
    name: 'React XSS via innerHTML & WCAG 2.2 AA Contrast/ARIA Violations',
    language: 'typescript',
    category: 'Accessibility & Quality',
    summary: 'dangerouslySetInnerHTML without DOMPurify, unsemantic click handlers on div elements, missing alt attributes, and nested quadratic search.',
    vulnerableCode: `// ⚠️ Insecure & Non-Accessible React Component
import React, { useState } from 'react';

export function UserProfileCard({ user, posts, onSelect }: any) {
  const [active, setActive] = useState(false);

  // ❌ Performance: Quadratic O(N^2) search on every render
  const userPosts = posts.filter((p: any) => {
    return posts.some((other: any) => other.authorId === user.id && other.id === p.id);
  });

  return (
    // ❌ WCAG violation: Non-interactive div with onClick (no role, no onKeyDown, no tabIndex)
    <div className="card" onClick={() => onSelect(user.id)}>
      {/* ❌ WCAG 1.1.1: Missing alt attribute */}
      <img src={user.avatarUrl} />
      
      <h3>{user.name}</h3>
      
      {/* ❌ OWASP A03 XSS: Raw unescaped user-supplied bio inserted directly! */}
      <div dangerouslySetInnerHTML={{ __html: user.bioHtml }} />

      <p style={{ color: '#bbb', backgroundColor: '#fff' }}>Status: Active</p> {/* ❌ Low contrast ratio */}
    </div>
  );
}`,
    hardenedPatch: `/**
 * Hardened Accessible & Secure React Component
 * Strict compliance with WCAG 2.2 AA and Zero-Trust sanitization
 */

import React, { useMemo, FC, KeyboardEvent } from 'react';

export interface Post {
  readonly id: string;
  readonly authorId: string;
  readonly title: string;
}

export interface User {
  readonly id: string;
  readonly name: string;
  readonly avatarUrl: string;
  readonly bio: string; // Plain text preferred over arbitrary HTML
  readonly isActive: boolean;
}

interface UserProfileCardProps {
  readonly user: User;
  readonly posts: readonly Post[];
  readonly onSelect: (userId: string) => void;
}

export const UserProfileCard: FC<UserProfileCardProps> = ({ user, posts, onSelect }) => {
  // 1. Performance: O(N) linear filter memoized against reference mutations
  const userPosts = useMemo(() => {
    return posts.filter((post) => post.authorId === user.id);
  }, [posts, user.id]);

  // 2. Accessibility: Keyboard interaction support for WCAG 2.1.1 Keyboard
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(user.id);
    }
  };

  return (
    <article 
      className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-left"
      aria-labelledby={\`user-title-\${user.id}\`}
    >
      <div className="flex items-start gap-4">
        {/* WCAG 1.1.1: Descriptive alt text with fallback handling */}
        <img
          src={user.avatarUrl}
          alt={\`Profile photograph of \${user.name}\`}
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-full object-cover shrink-0 bg-slate-100 dark:bg-slate-800"
          onError={(e) => {
            // Defensive image fallback avoiding broken frame
            (e.currentTarget as HTMLElement).style.display = 'none';
          }}
        />

        <div className="flex-1 min-w-0">
          <h2 id={\`user-title-\${user.id}\`} className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
            {user.name}
          </h2>

          {/* Zero-Trust: Safely rendered as plain text, eliminating XSS vectors */}
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
            {user.bio}
          </p>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            {/* Contrast-compliant status indicator with text description */}
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              {user.isActive ? 'Active Member' : 'Inactive'}
            </span>
            <span className="font-mono tabular-nums">{userPosts.length} posts</span>
          </div>
        </div>
      </div>

      {/* Semantic interactive button control with full focus ring */}
      <button
        type="button"
        onClick={() => onSelect(user.id)}
        onKeyDown={handleKeyDown}
        className="mt-4 w-full py-2 px-4 text-xs font-medium text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-md transition-colors"
      >
        View Profile Details
      </button>
    </article>
  );
};`,
  },
  {
    id: 'fastapi-unhandled-leak',
    name: 'Python Service with Uncaught Async Exceptions & Global State Mutation',
    language: 'python',
    category: 'Performance & Big-O',
    summary: 'Global state concurrency race conditions, lack of pydantic schema validation, and missing timeout guards on external HTTP calls.',
    vulnerableCode: `# ⚠️ Insecure & Fragile Python Microservice
import requests
from fastapi import FastAPI

app = FastAPI()
GLOBAL_CACHE = {} # ❌ Race condition: Unsynchronized global mutable state

@app.post("/process-order")
async def process_order(data: dict): # ❌ Missing Pydantic Schema
    order_id = data["id"] # ❌ Unchecked KeyError risk!
    
    # ❌ Blocking synchronous call inside async endpoint! Blocks event loop!
    resp = requests.post("https://payment-provider.internal/charge", json=data) 
    
    GLOBAL_CACHE[order_id] = resp.json() # ❌ Unbounded memory leak
    return {"status": "ok"}`,
    hardenedPatch: `"""
Production-Hardened FastAPI Microservice
Adhering to SOLID, Zero-Trust validation, and Non-blocking Concurrency
"""

import os
import httpx
from pydantic import BaseModel, Field, HttpUrl
from fastapi import FastAPI, HTTPException, status
from contextlib import asynccontextmanager

# Enforce secure environment configuration
PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL", "https://payment-provider.internal/charge")

class OrderItem(BaseModel):
    item_id: str = Field(..., min_length=1, max_length=64)
    quantity: int = Field(..., gt=0, le=1000)
    unit_price_cents: int = Field(..., gt=0)

class ProcessOrderRequest(BaseModel):
    order_id: str = Field(..., min_length=36, max_length=36, description="RFC 4122 UUID")
    user_id: str = Field(..., min_length=1, max_length=64)
    items: list[OrderItem] = Field(..., min_items=1, max_items=100)
    idempotency_key: str = Field(..., min_length=16, max_length=128)

class ProcessOrderResponse(BaseModel):
    order_id: str
    status: str
    transaction_id: str

# Reusable Async Client with Connection Pooling & Strict Timeouts
async_client: httpx.AsyncClient | None = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global async_client
    async_client = httpx.AsyncClient(timeout=httpx.Timeout(connect=2.0, read=5.0, write=5.0, pool=10.0))
    yield
    await async_client.aclose()

app = FastAPI(lifespan=lifespan)

@app.post(
    "/api/v1/orders",
    response_model=ProcessOrderResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Process customer order with idempotency"
)
async def process_order(payload: ProcessOrderRequest) -> ProcessOrderResponse:
    if not async_client:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment client runtime uninitialized"
        )

    try:
        # Non-blocking async outbound request with idempotency header
        response = await async_client.post(
            PAYMENT_SERVICE_URL,
            json=payload.model_dump(),
            headers={"X-Idempotency-Key": payload.idempotency_key}
        )
        response.raise_for_status()
        payment_data = response.json()

        return ProcessOrderResponse(
            order_id=payload.order_id,
            status="CONFIRMED",
            transaction_id=payment_data.get("tx_id", "pending")
        )

    except httpx.TimeoutException:
        # Defensive isolation: Prevent cascading failure
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Downstream payment service timed out"
        )
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Downstream service returned {exc.response.status_code}"
        )`,
  },
];
