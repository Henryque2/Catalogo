## (Projeto feito com auxílio da IA Claude Sonnet 4.6 para fins escolares)
# 🎬 CineVerse — App de Filmes React Native

Aplicativo de filmes multiplataforma (iOS, Android e Web) construído com **React Native + Expo**.

---

## ✨ Funcionalidades

- **Banner Principal (Hero)** — Destaque animado do filme em cartaz com backdrop, sinopse e ações
- **Catálogo de Filmes** — Grade responsiva com 8 filmes, filtro por categoria
- **Tela de Detalhes** — Informações completas: sinopse, elenco, diretor, avaliação, duração
- **Navbar** — Logo, menu de navegação (web), contador de favoritos
- **Footer** — Rodapé com marca e links
- **Botão Favoritar** — Persistência em estado global via Context API (❤️/🤍)

---

## 🧩 Componentes React Native Principais

| Componente | Uso |
|---|---|
| `ImageBackground` | Banner hero e cards de filmes |
| `ScrollView` | Scroll da Home e da tela de Detalhes |
| `TouchableOpacity` | Todos os botões interativos |
| `Text` | Toda tipografia do app |

---

## 📦 Stack

| Lib | Versão |
|---|---|
| expo | ~52.0.0 |
| react | 18.3.1 |
| react-native | 0.76.5 |
| react-native-web | ~0.19.13 |
| expo-status-bar | ~2.0.0 |

---

## 🚀 Como Rodar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
cd MovieApp
npm install
```

### Iniciar (escolha uma plataforma)

```bash
# Web (browser)
npm run web

# iOS (precisa do Xcode no Mac)
npm run ios

# Android (precisa do Android Studio / emulador)
npm run android

# Menu interativo (escolher plataforma)
npm start
```

Após `npm run web`, o app abre em `http://localhost:8081` no navegador.

---

## 📁 Estrutura de Arquivos

```
MovieApp/
├── App.js                        # Entry point, navegação entre telas
├── app.json                      # Configuração Expo
├── babel.config.js               # Configuração Babel
├── package.json                  # Dependências
└── src/
    ├── context/
    │   └── FavoritesContext.js   # Estado global dos favoritos
    ├── data/
    │   └── movies.js             # Catálogo de filmes (8 filmes)
    ├── components/
    │   ├── Navbar.js             # Barra de navegação superior
    │   ├── Footer.js             # Rodapé
    │   ├── HeroBanner.js         # Banner principal com ImageBackground
    │   ├── MovieCard.js          # Card de filme com ImageBackground
    │   └── CategoryFilter.js     # Chips de categoria com ScrollView horizontal
    └── screens/
        ├── HomeScreen.js         # Tela principal com catálogo
        └── DetailScreen.js       # Tela de detalhes do filme
```

---

## 🎨 Design

- **Tema**: Dark cinema (fundo `#0a0a0f`)
- **Accent**: Vermelho Netflix-inspired (`#e50914`)
- **Tipografia**: Pesos 400–900, letterSpacing negativo nos títulos
- **Responsivo**: Layout adapta para mobile (< 768px) e web/tablet

---

## ⚙️ Compatibilidade

O app usa apenas APIs estáveis do React Native e Expo SDK 52, garantindo:
- ✅ Compatibilidade retroativa com Expo SDK 51+
- ✅ Funciona no React Native 0.73+
- ✅ Suporte total à web via `react-native-web`
- ✅ Sem dependências nativas extras (puro JS/TS)
