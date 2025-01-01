interface Env {
  BASIC_USER?: string;
  BASIC_PASS?: string;
}

export const onRequest = async ({ request, next, env }: { request: Request; next: (request: Request) => Promise<Response>; env: Env }) => {
  // Basic認証のクレデンシャルを環境変数から取得（デフォルト値を設定）
  const BASIC_USER = env.BASIC_USER ?? "no-set-user";
  const BASIC_PASS = env.BASIC_PASS ?? "no-set-pass";

  // Authorization ヘッダーを取得
  const authorization = request.headers.get("Authorization");

  // Basic認証の検証
  if (!authorization) {
    return new Response("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  const [scheme, encoded] = authorization.split(" ");

  if (!encoded || scheme !== "Basic") {
    return new Response("Invalid authentication credentials", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  const buffer = Uint8Array.from(atob(encoded), (character) =>
    character.charCodeAt(0)
  );
  const decoded = new TextDecoder().decode(buffer).toString();
  const [username, password] = decoded.split(":");

  if (username !== BASIC_USER || password !== BASIC_PASS) {
    return new Response("Invalid authentication credentials", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  return next(request);
}; 
