interface Env {
  PASS?: string;
}

export const onRequest = async ({ request, next, env }: { request: Request; next: (request: Request) => Promise<Response>; env: Env }) => {
  const url = new URL(request.url);
  const passParam = url.searchParams.get("pass");
  const correctPass = env.PASS ?? "no-set-pass";

  if (passParam !== correctPass) {
    return new Response("Access Denied", {
      status: 403,
    });
  }

  // パスワードが正しい場合は、クエリパラメータを除去したURLにリダイレクト
  if (passParam) {
    url.searchParams.delete("pass");
    return Response.redirect(url.toString(), 302);
  }

  return next(request);
}; 
