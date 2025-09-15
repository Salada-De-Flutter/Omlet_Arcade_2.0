/**
 * Lista posts para o feed com paginação e filtros opcionais, incluindo dados do autor (username, usericon).
 * Query params:
 *  - page (default 1)
 *  - pageSize (default 10, máx 100)
 *  - comunidade_id (opcional)
 *  - usuario_id (opcional)
 *  - q (opcional; busca simples em title ou plain_text ILIKE)
 */
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase env vars");
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!, { fetch });

const jsonHeaders: Record<string, string> = { "Content-Type": "application/json" };
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  Connection: "keep-alive"
};

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (req.method !== "GET") {
      return respond({ error: "Método não permitido" }, 405);
    }

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
    const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") ?? "10")));
    const offset = (page - 1) * pageSize;
    const comunidadeFilter = url.searchParams.get("comunidade_id");
    const usuarioFilter = url.searchParams.get("usuario_id");
    const q = url.searchParams.get("q")?.trim() || "";

    // Select com join em usuarios
    // Nota: Forma: foreignTable(column1,column2)
    let query = supabase
      .from("posts")
      .select(
        `id, usuario_id, comunidade_id, title, banner_url, banner_is_gif, plain_text, created_at, usuarios:usuario_id ( username, usericon )`,
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (comunidadeFilter) {
      query = query.eq("comunidade_id", comunidadeFilter);
    }
    if (usuarioFilter) {
      query = query.eq("usuario_id", usuarioFilter);
    }
    if (q) {
      query = query.or(`title.ilike.%${q}%,plain_text.ilike.%${q}%`);
    }

    const { data, error, count } = await query;
    if (error) {
      return respond({ error: error.message }, 500);
    }

    const mapped = (data ?? []).map((r: any) => ({
      id: r.id,
      title: r.title,
      bannerUrl: r.banner_url,
      bannerIsGif: r.banner_is_gif,
      snippet: r.plain_text?.length > 160 ? r.plain_text.slice(0, 157) + "..." : r.plain_text,
      usuarioId: r.usuario_id,
      comunidadeId: r.comunidade_id,
      createdAt: r.created_at,
      username: r.usuarios?.username ?? null,
      usericon: r.usuarios?.usericon ?? null
    }));

    const total = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return new Response(
      JSON.stringify({ page, pageSize, total, totalPages, items: mapped }),
      {
        status: 200,
        headers: {
          ...jsonHeaders,
            ...corsHeaders,
          "Cache-Control": "max-age=15",
          "X-Total-Count": String(total)
        }
      }
    );
  } catch (err: any) {
    return respond({ error: err?.message ?? String(err) }, 500);
  }
});

function respond(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...jsonHeaders, ...corsHeaders } });
}
