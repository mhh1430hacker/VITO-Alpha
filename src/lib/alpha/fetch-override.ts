'use client'

import { getAlphaStubResponse } from './interceptor'

if (typeof window !== 'undefined') {
  const _origFetch = window.fetch.bind(window)

  window.fetch = function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    const method = init?.method || 'GET'
    let body = init?.body
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch { /* not JSON */ }
    }

    const stub = getAlphaStubResponse({
      url: url.replace(/^https?:\/\/[^/]+/, ''),
      method,
      data: body,
    })

    if (stub) {
      return Promise.resolve(
        new Response(JSON.stringify(stub.data), {
          status: stub.status,
          statusText: 'OK (alpha)',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    }

    return _origFetch(input, init)
  }
}
