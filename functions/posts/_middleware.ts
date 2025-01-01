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


  return next(request);
}; 
