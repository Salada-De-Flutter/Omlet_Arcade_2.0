# 🎮 Omlet Arcade 2.0

Um aplicativo móvel inspirado no Omlet Arcade, desenvolvido com React Native e Expo, focado em gaming e comunidades.

## 📱 Sobre o Projeto

O Omlet Arcade 2.0 é uma plataforma social para gamers que permite:
- Criar e gerenciar comunidades de jogos
- Compartilhar posts e conteúdo relacionado a games
- Fazer transmissões ao vivo das suas aventuras de jogos
- Conectar-se com outros jogadores

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento e deploy
- **TypeScript** - Linguagem tipada para JavaScript
- **React Navigation** - Navegação entre telas
- **Expo Router** - Sistema de roteamento baseado em arquivos
- **React Context** - Gerenciamento de estado global
- **Expo Image Picker** - Seleção de imagens
- **Expo Vector Icons** - Ícones vetorizados

## 📁 Estrutura do Projeto

```
src/
├── app/                      # Telas da aplicação (Expo Router)
│   ├── _layout.tsx          # Layout global com SafeArea
│   ├── index.tsx            # Tela inicial/onboarding
│   ├── login-screen.tsx     # Tela de login
│   ├── criar-conta.tsx      # Tela de criação de conta
│   ├── definir-senha.tsx    # Tela para definir senha
│   ├── home-screen.tsx      # Tela principal/feed
│   ├── criar-post.tsx       # Tela para criar posts
│   ├── comunidades-screen.tsx  # Listagem de comunidades
│   ├── comunidade.tsx       # Detalhes da comunidade
│   └── criar-comunidade.tsx # Criação de comunidades
├── components/              # Componentes reutilizáveis
│   ├── BottomBar.tsx        # Barra de navegação inferior
│   ├── CommunityCard.tsx    # Card de comunidade
│   ├── ErrorBoundary.tsx    # Tratamento de erros
│   └── SafeWrapper.tsx      # Wrapper para SafeArea personalizado
├── context/                 # Contextos React
│   └── UserContext.tsx      # Contexto do usuário
└── styles/                  # Estilos globais (se necessário)
```

## 🎨 Design System

### Cores Principais
- **Background**: `#1f2430` - Fundo escuro principal
- **Secondary**: `#2a2f3a` - Bordas e elementos secundários
- **Primary**: `#ff6b58` - Cor de destaque (laranja/vermelho)
- **Blue**: `#4a9eff` - Cor azul para links e ações
- **Text**: `#ffffff` - Texto principal
- **Text Secondary**: `#8b8f96` - Texto secundário

### Tipografia
- **Fonte Principal**: System Font
- **Tamanhos**: 12px, 14px, 16px, 18px, 20px, 24px, 28px, 30px

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Android Studio (para Android) ou Xcode (para iOS)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Salada-De-Flutter/Omlet_Arcade_2.0.git
cd Omlet_Arcade_2.0
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
# Desenvolvimento
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📱 Funcionalidades Implementadas

### ✅ Autenticação
- [x] Tela de onboarding
- [x] Login de usuário
- [x] Criação de conta com foto de perfil
- [x] Definição de senha
- [x] Upload de imagem para ImgBB

### ✅ Interface
- [x] SafeArea global configurado
- [x] Navigation drawer personalizado
- [x] Bottom navigation bar
- [x] Tema escuro consistente
- [x] Design responsivo

### ✅ Posts e Conteúdo
- [x] Tela para criar posts
- [x] Seleção de imagens
- [x] Editor de texto
- [x] Toolbar de formatação
- [x] Preview de posts

### ✅ Comunidades
- [x] Listagem de comunidades
- [x] Visualização de detalhes
- [x] Estrutura para criação
- [x] Cards de comunidades

### 🔄 Em Desenvolvimento
- [ ] Sistema de posts funcionais
- [ ] Feed de atividades
- [ ] Sistema de likes e comentários
- [ ] Transmissões ao vivo
- [ ] Chat em tempo real
- [ ] Notificações push

## 🔧 Configurações Importantes

### SafeArea Global
O projeto utiliza um sistema de SafeArea global configurado no `_layout.tsx` que:
- Evita sobreposição das barras do sistema
- Funciona tanto no Android quanto iOS
- Elimina a necessidade de SafeArea individual em cada tela

### Context API
O `UserContext` gerencia o estado do usuário globalmente, incluindo:
- Informações de login
- Foto de perfil
- Dados da sessão

## 📊 Performance

- Renderização otimizada com componentes funcionais
- Lazy loading para imagens
- Gestão eficiente de estado
- Navegação otimizada com Expo Router

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Salada-De-Flutter** - *Desenvolvimento inicial* - [GitHub](https://github.com/Salada-De-Flutter)

## 🙏 Agradecimentos

- Inspirado no Omlet Arcade original
- Comunidade React Native
- Expo Team
- Material Design Guidelines

---

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, por favor:
1. Verifique se já existe uma [issue](https://github.com/Salada-De-Flutter/Omlet_Arcade_2.0/issues) relacionada
2. Caso não exista, crie uma nova issue detalhando o problema
3. Para dúvidas gerais, use as [Discussions](https://github.com/Salada-De-Flutter/Omlet_Arcade_2.0/discussions)

---

**🎮 Desenvolvido com ❤️ para a comunidade gamer**