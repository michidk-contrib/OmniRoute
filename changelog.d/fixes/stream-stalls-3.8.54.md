Cache request body size and token estimates across streamed usage events, and
use a linear token estimate for large requests. This avoids event loop stalls
when long agent conversations stream many SSE chunks.
