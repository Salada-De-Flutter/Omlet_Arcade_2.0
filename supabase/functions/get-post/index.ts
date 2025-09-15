/**
 * Retorna uma postagem específica por id com dados do autor.
 * Endpoint: /functions/v1/get-post?id=<uuid>
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
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (req.method !== 'GET') {
      return respond({ error: 'Método não permitido' }, 405);
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return respond({ error: 'Parâmetro id obrigatório' }, 400);

    const { data, error } = await supabase
      .from('posts')
      .select(`id, usuario_id, comunidade_id, title, banner_url, banner_is_gif, html_content, plain_text, created_at, usuarios:usuario_id ( username, usericon )`)
      .eq('id', id)
      .limit(1)
      .maybeSingle();

    if (error) return respond({ error: error.message }, 500);
    if (!data) return respond({ error: 'Post não encontrado' }, 404);

    const post = {
      id: data.id,
      title: data.title,
      bannerUrl: data.banner_url,
      bannerIsGif: data.banner_is_gif,
      html: data.html_content,
      plain: data.plain_text,
      usuarioId: data.usuario_id,
      comunidadeId: data.comunidade_id,
      createdAt: data.created_at,
      username: data.usuarios?.username ?? null,
      usericon: data.usuarios?.usericon ?? null
    };

    return new Response(JSON.stringify(post), { status: 200, headers: { ...jsonHeaders, ...corsHeaders, 'Cache-Control': 'max-age=10' } });
  } catch (err: any) {
    return respond({ error: err?.message ?? String(err) }, 500);
  }
});

function respond(body: any, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...jsonHeaders, ...corsHeaders } });
}
