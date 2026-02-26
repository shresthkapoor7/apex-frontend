const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://apex-backend-production-1266.up.railway.app";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = await fetch(`${API_BASE}/documents/${id}/file`, {
    headers: { Accept: "application/pdf" },
    cache: "no-store",
  });

  if (!res.ok) {
    return new Response(null, { status: res.status });
  }

  const blob = await res.blob();
  const contentType = res.headers.get("Content-Type") ?? "application/pdf";
  const contentDisposition =
    res.headers.get("Content-Disposition") ?? 'inline; filename="document.pdf"';

  return new Response(blob, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": contentDisposition,
    },
  });
}
