<p align="center">
	<img src="assets/Omlet_Arcade.webp" alt="Omlet Arcade Icon" width="140" />
</p>

## Omlet Arcade 2.0

Objetivo: recriar de forma simples a ideia do antigo Omlet Arcade — feed de posts, comunidades e interação básica entre jogadores. Projeto em evolução para praticar React Native + Expo + Supabase.

### O que já tem
- Criação de post com banner e editor rich text
- Feed paginado com cards
- Detalhe do post (HTML renderizado)
- Usuário (mock / estrutura inicial de contexto)

### Próximos (ideias)
- Likes e comentários
- Comunidades com listagem real
- Melhorar perfil do usuário
- Notificações simples (in-app)

### Stack resumida
React Native (Expo) + TypeScript + Expo Router + Supabase (Edge Functions) + WebView para HTML.

### Rodar local
```bash
npm install
npx expo start --tunnel
```

Se quiser abrir no Android: use o app Expo Go e escaneie o QR ou, só entrar via --tunnel.

### Estrutura simples
```
src/app -> telas
src/components -> componentes reutilizáveis
src/context -> contexto de usuário
```

### Aviso
Código de aprendizado. Algumas partes serão refatoradas depois (ex: segurança / otimizações / layout).

### Autor
Salada-De-Flutter

---
Se curtir a ideia e quiser sugerir algo, manda ver nas issues futuramente.